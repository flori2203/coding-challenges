import {Box, Button, Card, CardActions, Stack, CardContent, CardHeader, Grid, TextField} from '@mui/material';
import CreateMember from "../../features/Xml/CreateMember";
import MemberCards from "../../features/Xml/MemberCards";

const XmlDisplay = () => {
  return (
    <Grid container>
      <CreateMember />
      <MemberCards />
    </Grid>
  );
};

export default XmlDisplay;
