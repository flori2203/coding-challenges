import React, {useState} from "react";
import {
  Box,
  Button, Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  MenuItem, Pagination,
  Select,
  Stack,
  TextField, Typography
} from "@mui/material";
import plantConfig from "./plantConfiguration.json";
import {CameraStream} from "./CameraStream";

export const VideoStreamGrid = () => {
  const lanes = plantConfig.Lanes;
  const cameras = plantConfig.Cameras;
  const loadingPoints = plantConfig.LoadingPoints;

  const [selectedLaneName, setSelectedLaneName] = useState(lanes[0].Name);
  const [selectedPage, setSelectedPage] = useState(0);

  const selectedLane = lanes.find(lane => lane.Name === selectedLaneName);
  const loadingPointsOfLane = loadingPoints.filter(loadingPoint => loadingPoint.LaneId === selectedLane!.Id);
  const camerasOfLane = cameras.filter(camera => loadingPointsOfLane.find(loadingPoint => loadingPoint.CameraIds[0] === camera.Id));

  const cameraStreamObjects = camerasOfLane.map(camera => {
    return {
      camera: camera,
      laneName: selectedLane?.Name,
      loadingPointName: loadingPointsOfLane.find(loadingPoint => loadingPoint.CameraIds[0] === camera.Id)?.Name
    }
  });

  const pageCount = Math.ceil(cameraStreamObjects.length / 6);

  const cameraStreams = cameraStreamObjects.map(cameraStreamObject => {
    return <CameraStream key={cameraStreamObject.camera.Id} cameraStreamObject={cameraStreamObject} />
  });

  const cameraStreamsToDisplay = cameraStreams.slice(selectedPage * 6, selectedPage * 6 + 6);

  return <>
    <Grid item xs={12} sx={{mt: 1}}>
      <Card sx={{borderRadius: "7px"}}>
        <CardContent>
          <Stack flexDirection={"row"} justifyContent={"center"} alignItems={"Center"}>

          <Typography variant={"h6"} sx={{mr: 2}}>
            Spur auswählen:
          </Typography>

          <Select
            value={selectedLaneName}
            onChange={(e) => {
              setSelectedLaneName(e.target.value);
              setSelectedPage(0);
            }}
            sx={{
              '.MuiOutlinedInput-notchedOutline': {
                borderColor: theme => theme.palette.text.disabled,
              },
            }}>
            {lanes.map(lane => <MenuItem key={lane.Id} value={lane.Name}>{lane.Name}</MenuItem>)}
          </Select>
          </Stack>

        </CardContent>
      </Card>
    </Grid>

    {cameraStreamsToDisplay}

    <Grid item xs={12} sx={{my: 2}}>
      <Stack justifyContent={"center"} alignItems={"center"}>
        <Pagination count={pageCount} page={selectedPage + 1} onChange={(e, newPage) => {setSelectedPage(newPage - 1)}} />
      </Stack>
    </Grid>
  </>
}
