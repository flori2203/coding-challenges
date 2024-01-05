import React, {useEffect} from "react";
import {
  Accordion, AccordionDetails, AccordionSummary,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  MenuItem,
  Select,
  Stack,
  TextField, Typography
} from "@mui/material";
import {useQuery} from "@tanstack/react-query";
import axios from "axios";
import LoadingSpinner from "../../../components/UI/LoadingSpinner";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface Member {
  name: string;
  email: string;
  age: number;
  premium: boolean;
}

const MemberCards = () => {
  const [members, setMembers] = React.useState<Member[]>([]);
  const [xml, setXml] = React.useState<Document>();

  const { data, isLoading } = useQuery(["members"], async () => {
    const { data } = await axios.get("http://localhost:5251/Member");
    return data;
  }, {
    refetchInterval: 500
  });




  useEffect(() => {
    if (data) {
      const parser = new DOMParser();
      const xml = parser.parseFromString(data, 'text/xml');

      const membersXml = Array.from(xml.getElementsByTagName("Member"));
      const members = membersXml.map(member => {
        return {
          name: member.getElementsByTagName("MemberName")[0].innerHTML,
          email: member.getElementsByTagName("MemberEmail")[0].innerHTML,
          age: parseInt(member.getElementsByTagName("Age")[0].innerHTML),
          premium: member.getAttribute("PremiumMember") === "true"
        }
      });

      setMembers(members);
      setXml(xml);
    }
  }, [data]);






  if (!data || isLoading) {
    return <Grid item xs={12} sx={{mt: 2, display: "flex", justifyContent: "center"}}><LoadingSpinner /></Grid>;
  }

  const memberCards = members.map((member, index) => {
    return <Grid item xs={12} sm={6} md={6} lg={4} xl={4} key={member.email}>
      <Card sx={{borderRadius: "7px"}}>
        <CardHeader title={member.name} />
        <CardContent>
          <Stack gap={1} direction={"column"} >
            <TextField label={"Email"} value={member.email} disabled/>
            <TextField label={"Alter"} value={member.age} disabled/>
            <TextField label={"Premium"} value={member.premium ? "Ja" : "Nein"} disabled/>
            <Accordion  variant={"outlined"}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
              >
                <Typography>XML</Typography>
              </AccordionSummary>
              <AccordionDetails sx={{overflow: "auto"}}>
                <Typography variant={"body2"}>
                  {xml?.getElementsByTagName("Member").item(index)?.outerHTML}
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Stack>
        </CardContent>
      </Card>
    </Grid>
  });

  return <Grid item xs={12} sx={{mt: 2}}>
    <Grid container spacing={2}>
      {memberCards}
    </Grid>
  </Grid >
}

export default MemberCards;
