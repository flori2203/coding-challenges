import { Chip, Grid, Stack } from '@mui/material';
import { plantConfiguration as plantConfig } from './plantConfiguration';
import { useEffect } from 'react';

type CameraStreamObject = {
  camera: (typeof plantConfig.Cameras)[0];
  laneName?: string;
  loadingPointName?: string;
};

interface CameraStreamProps {
  cameraStreamObject: CameraStreamObject;
}

export const CameraStream: React.FC<CameraStreamProps> = ({
  cameraStreamObject,
}) => {
  useEffect(() => {
    // test("http://192.168.213.129:8889/test1/");

    const streamUrl = cameraStreamObject.camera.StreamUrl;

    const retryPause = 2000;

    const video = document.getElementById(cameraStreamObject.camera.Id) as HTMLVideoElement;

    type parsedOffer = {
      iceUfrag: string;
      icePwd: string;
      medias: string[];
    };

    let peerConnection: RTCPeerConnection | null = null;
    let restartTimeout: ReturnType<typeof setTimeout> | null = null;
    let sessionUrl = '';
    let offerData: parsedOffer;
    let queuedCandidates: RTCIceCandidate[] = [];

    const unquoteCredential = (v: string) => JSON.parse(`"${v}"`);

    const linkToIceServers = (links: string | null) =>
      links !== null
        ? links.split(', ').map((link) => {
            const m = link.match(
              /^<(.+?)>; rel="ice-server"(; username="(.*?)"; credential="(.*?)"; credential-type="password")?/i
            );
            const ret: RTCIceServer = {
              urls: [m![1]],
            };

            if (m![3] !== undefined) {
              ret.username = unquoteCredential(m![3]);
              ret.credential = unquoteCredential(m![4]);
            }

            return ret;
          })
        : [];

    const parseOffer = (offer: string) => {
      const parsedOffer: parsedOffer = {
        iceUfrag: '',
        icePwd: '',
        medias: [],
      };

      /* console.log(offer); */

      for (const line of offer.split('\r\n')) {
        if (line.startsWith('m=')) {
          parsedOffer.medias.push(line.slice('m='.length));
        } else if (
          parsedOffer.iceUfrag === '' &&
          line.startsWith('a=ice-ufrag:')
        ) {
          parsedOffer.iceUfrag = line.slice('a=ice-ufrag:'.length);
        } else if (parsedOffer.icePwd === '' && line.startsWith('a=ice-pwd:')) {
          parsedOffer.icePwd = line.slice('a=ice-pwd:'.length);
        }
      }

      return parsedOffer;
    };

    /* const enableStereoOpus = (section: string) => {
      let opusPayloadFormat = "";
      const lines = section.split("\r\n");

      for (let i = 0; i < lines.length; i++) {
        if (
          lines[i].startsWith("a=rtpmap:") &&
          lines[i].toLowerCase().includes("opus/")
        ) {
          opusPayloadFormat = lines[i].slice("a=rtpmap:".length).split(" ")[0];
          break;
        }
      }

      if (opusPayloadFormat === "") {
        return section;
      }

      for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith("a=fmtp:" + opusPayloadFormat + " ")) {
          if (!lines[i].includes("stereo")) {
            lines[i] += ";stereo=1";
          }
          if (!lines[i].includes("sprop-stereo")) {
            lines[i] += ";sprop-stereo=1";
          }
        }
      }

      return lines.join("\r\n");
    }; */

    /* const editOffer = (offer: RTCSessionDescriptionInit) => {
      const sections = offer.sdp!.split("m=");

      for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        if (section.startsWith("audio")) {
          sections[i] = enableStereoOpus(section);
        }
      }

      offer.sdp = sections.join("m=");
    }; */

    const generateSdpFragment = (od: any, candidates: RTCIceCandidate[]) => {
      const candidatesByMedia: { [key: number]: RTCIceCandidate[] } = {};
      for (const candidate of candidates) {
        const mid = candidate.sdpMLineIndex!;
        if (candidatesByMedia[mid] === undefined) {
          candidatesByMedia[mid] = [];
        }
        candidatesByMedia[mid].push(candidate);
      }

      let frag =
        'a=ice-ufrag:' +
        od.iceUfrag +
        '\r\n' +
        'a=ice-pwd:' +
        od.icePwd +
        '\r\n';

      let mid = 0;

      for (const media of od.medias) {
        if (candidatesByMedia[mid] !== undefined) {
          frag += 'm=' + media + '\r\n' + 'a=mid:' + mid + '\r\n';

          for (const candidate of candidatesByMedia[mid]) {
            frag += 'a=' + candidate.candidate + '\r\n';
          }
        }
        mid++;
      }

      return frag;
    };

    const sendLocalCandidates = (candidates: RTCIceCandidate[]) => {
      fetch(sessionUrl + window.location.search, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/trickle-ice-sdpfrag',
          'If-Match': '*',
        },
        body: generateSdpFragment(offerData, candidates),
      })
        .then((res) => {
          switch (res.status) {
            case 204:
              break;
            case 404:
              throw new Error('stream not found');
            default:
              throw new Error(`bad status code ${res.status}`);
          }
        })
        .catch((err) => {
          onError(err.toString());
        });
    };

    const onRemoteAnswer = (sdp: string) => {
      if (restartTimeout !== null) {
        return;
      }

      /* console.log("Remote answer:", sdp); */

      peerConnection!.setRemoteDescription(
        new RTCSessionDescription({
          type: 'answer',
          sdp,
        })
      );

      if (queuedCandidates.length !== 0) {
        sendLocalCandidates(queuedCandidates);
        queuedCandidates = [];
      }
    };

    const sendOffer = (offer: RTCSessionDescriptionInit) => {
      /* console.log("Send offer");
      console.log(offer.sdp); */
      fetch(new URL('whep', streamUrl).toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/sdp',
        },
        body: offer.sdp!,
      })
        .then((res) => {
          console.log(res.status);
          switch (res.status) {
            case 201:
              break;
            case 404:
              throw new Error('stream not found');
            default:
              throw new Error(`bad status code lol ${res.status}`);
          }
          console.log('Location: ', res.headers.get('location'));
          sessionUrl = new URL(
            res.headers.get('location')!,
            streamUrl
          ).toString();
          return res.text();
        })
        .then((sdp) => onRemoteAnswer(sdp))
        .catch((err) => {
          onError('error sending offer: ' + err.toString());
        });
    };

    const createOffer = async () => {
      const offer = await peerConnection!.createOffer();

      //editOffer(offer);  // Enable stereo opus - not needed until we have audio
      offerData = parseOffer(offer.sdp!);
      peerConnection!.setLocalDescription(offer);
      sendOffer(offer);
    };

    const onConnectionState = () => {
      if (restartTimeout !== null) {
        return;
      }

      if (peerConnection!.iceConnectionState === 'disconnected') {
        onError('peer connection disconnected');
      }
    };

    const onTrack = (evt: RTCTrackEvent) => {
      video.srcObject = evt.streams[0];
    };

    const onLocalCandidate = (evt: RTCPeerConnectionIceEvent) => {
      if (restartTimeout !== null) {
        return;
      }

      if (evt.candidate !== null) {
        if (sessionUrl === '') {
          queuedCandidates.push(evt.candidate);
        } else {
          sendLocalCandidates([evt.candidate]);
        }
      }
    };

    const onError = (err: string) => {
      if (restartTimeout === null) {
        console.log(err + ', retrying in some seconds');

        if (peerConnection !== null) {
          peerConnection.close();
          peerConnection = null;
        }

        restartTimeout = setTimeout(() => {
          restartTimeout = null;
          loadStream(streamUrl);
        }, retryPause);

        /* if (sessionUrl) {
          fetch(sessionUrl, {
            method: "DELETE",
          }).catch((err) => console.log(err));
        } */
        sessionUrl = '';

        queuedCandidates = [];
      }
    };

    const loadStream = async (url: string) => {
      await fetch(new URL('whep', streamUrl), {
        method: 'OPTIONS',
      }).catch((err) => {
        onError('health check failed');
      });

      peerConnection = new RTCPeerConnection({
        iceServers: [
          {
            urls: ['stun:stun.l.google.com:19302'],
          },
        ],
      });

      const direction = 'recvonly';
      peerConnection.addTransceiver('video', { direction });

      peerConnection.oniceconnectionstatechange = () => onConnectionState();

      peerConnection.ontrack = (evt) => onTrack(evt);

      peerConnection.onicecandidate = (evt) => {
        console.log('ICE: ', evt.candidate);
        onLocalCandidate(evt);
      };
      createOffer();
    };

    loadStream(streamUrl);

    return () => {
      if (peerConnection !== null) {
        peerConnection.close();
        peerConnection = null;
      }

      if (restartTimeout !== null) {
        clearTimeout(restartTimeout);
        restartTimeout = null;
      }

      if (sessionUrl !== '') {
        fetch(sessionUrl, {
          method: 'DELETE',
        });
      }
      sessionUrl = '';
    };
  }, []);

  return (
    <Grid item xl={4} md={6} xs={12} sx={{ p: 1 }}>
      <Stack sx={{ width: '100%' }}>
        {/*<img
          src={cameraStreamObject.camera.StreamUrl}
          alt={cameraStreamObject.camera.Name}
          style={{ width: '100%', height: '100%', zIndex: 1 }}
        />*/}
        <video
          width={"100%"}
          height={"100%"}
          playsInline
          autoPlay
          muted
          id={cameraStreamObject.camera.Id}
        ></video>
        <Chip label={`Verladepunkt: ${cameraStreamObject.loadingPointName}`} />
      </Stack>
    </Grid>
  );
};
