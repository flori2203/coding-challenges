import React from "react";
import {Chip, Grid, Stack} from "@mui/material";
import {plantConfiguration as plantConfig} from "./plantConfiguration";

interface CameraStreamProps {
  cameraStreamObject: {
    camera: typeof plantConfig.Cameras[0];
    laneName?: string;
    loadingPointName?: string;
  };
}

export const CameraStream: React.FC<CameraStreamProps> = ({cameraStreamObject}) => {
  return <Grid item xl={4} md={6} xs={12} sx={{p: 1}}>
    <Stack sx={{width: "100%"}}>
      <img
        src={cameraStreamObject.camera.StreamUrl}
        alt={cameraStreamObject.camera.Name}
        style={{ width: "100%", height: "100%", zIndex: 1 }}
      />
      <Chip label={`Verladepunkt: ${cameraStreamObject.loadingPointName}`} />
    </Stack>
  </Grid>
}
