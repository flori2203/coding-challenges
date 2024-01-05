import React, {useState} from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  MenuItem,
  Select,
  Stack,
  TextField
} from "@mui/material";
import {useMutation} from "@tanstack/react-query";
import axios from "axios";

const CreateMember = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState(0);
  const [premium, setPremium] = useState<"false" | "true">("false");

  const xml = `<?xml version="1.0" encoding="utf-16"?>
  <Member xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" PremiumMember="${premium}">
  <MemberName>${name}</MemberName>
  <MemberEmail>${email}</MemberEmail>
  <Age>${age}</Age>
  </Member>`;

  const escapedXml = xml.replace(/\\n/g, "\\n")
    .replace(/\\'/g, "\\'")
    .replace(/\\"/g, '\\"')
    .replace(/\\&/g, "\\&")
    .replace(/\\r/g, "\\r")
    .replace(/\\t/g, "\\t")
    .replace(/\\b/g, "\\b")
    .replace(/\\f/g, "\\f");

  const {mutate} = useMutation(["createMember"], async () => {
    await axios.post("http://localhost:5251/Member", {xml: escapedXml})
  })
  const handleSubmit = () => {
    mutate();
  }

  return <Grid item xs={12} sx={{mt: 2}}>
    <Card sx={{borderRadius: "7px"}}>
      <CardHeader title={"Nutzer hinzufügen"} />
      <CardContent>
        <Stack gap={1} direction={"row"} justifyContent={"center"}>
          <TextField label={"Name"} sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: theme => theme.palette.text.disabled
              }
            },
          }} onChange={(e) => {setName(e.target.value)}}/>

          <TextField label={"Email"} sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: theme => theme.palette.text.disabled
              }
            },
          }} onChange={(e) => {setEmail(e.target.value)}}/>

          <TextField label={"Alter"} sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: theme => theme.palette.text.disabled
              }
            }
          }} onChange={(e) => {setAge(+e.target.value)}}/>

          <Select
            value={premium}
            onChange={(e) => {setPremium(e.target.value as "false" | "true")}}
            sx={{
              '.MuiOutlinedInput-notchedOutline': {
                borderColor: theme => theme.palette.text.disabled,
              },
            }}>
            <MenuItem value={"true"}>Premium</MenuItem>
            <MenuItem value={"false"}>Kein Premium</MenuItem>
          </Select>
        </Stack>
      </CardContent>
      <CardActions>
        <Button
          variant={"outlined"}
          sx={{background: theme => theme.palette.background.default}}
          onClick={handleSubmit}
          disabled={name === "" || email === "" || age === 0 }
        >Hinzufügen</Button>
      </CardActions>
    </Card>
  </Grid >
}

export default CreateMember;
