import "./emailSettings.scss"
import { useState, useEffect } from "react";
import Axios from "axios"

import Loading from "../../components/loading/Loading"

import Sidebar from "../../components/sidebar/Sidebar"
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Input from '@mui/material/Input';

import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import { Button } from "@mui/material";
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

function EmailSettings() {

    const [loading, setLoading] = useState(true);
    const [participantTemplate, setParticipantTemplate] = useState("");
    const [adminTemplate, setAdminTemplate] = useState("")
    const [reminderTemplate, setReminderTemplate] = useState("")

    const [emailHost, setEmailHost] = useState("")
    const [emailUsername, setEmailUsername] = useState("")
    const [emailPassword, setEmailPassword] = useState("")
    const [emailFrom, setEmailFrom] = useState("")
    const [emailTopic, setEmailTopic] = useState("")
    const [adminEmail, setAdminEmail] = useState("")
    const [port, setPort] = useState("")


    const [selectedSurveys, setSelectedSurveys] = useState([])
    

    useEffect(() => {
        GetTemplates();
        getEmailSettings();
    }, [])

    const UpdateData = () => {
        Axios({
            method: "POST",
            withCredentials: true,
            data: {
                for: "Admin",
                text: adminTemplate
            },
            url: process.env.REACT_APP_API_BASE + "/setEmailTemplate",})
        .then((res) => console.log(res.data))

        Axios({
          method: "POST",
          withCredentials: true,
          data: {
              for: "Reminder",
              text: reminderTemplate
          },
          url: process.env.REACT_APP_API_BASE + "/setEmailTemplate",})
      .then((res) => console.log(res.data))


      saveEmailSettings(() => {});

        Axios({
            method: "POST",
            withCredentials: true,
            data: {
                for: "Participant",
                text: participantTemplate,
                surveys: selectedSurveys
            },
            url: process.env.REACT_APP_API_BASE + "/setEmailTemplate",})
        .then((res) => alert("Data was updated!"));
    }

    const getEmailSettings = () => {
      Axios({
        method: "GET",
        withCredentials: true,
        url: process.env.REACT_APP_API_BASE + "/getEmailSettings",})
    .then((res) => setEmailSettings(res.data))
    }

    const GetTemplates = () => {
        Axios({
            method: "GET",
            withCredentials: true,
            url: process.env.REACT_APP_API_BASE + "/getEmailTemplates",})
        .then((res) => setEmailTemplates(res.data))
        .then(setLoading(false))
    }

    const saveEmailSettings = (callback) => {
      Axios({
        method: "POST",
        withCredentials: true,
        data: {
          emailHost : emailHost,
          emailUsername: emailUsername,
          emailPassword: emailPassword,
          emailTitleFrom: emailFrom,
          adminEmail: adminEmail,
          emailTopic: emailTopic,
          port: port,
        },
        url: process.env.REACT_APP_API_BASE + "/setEmailSettings",})
      .then((res) => {console.log(res); callback()})
    }

    const setEmailSettings = (data) => {
      data = data[0]
      setEmailHost(data.emailHost)
      setEmailUsername(data.emailUsername)
      setEmailPassword(data.emailPassword)
      setAdminEmail(data.adminEmail)
      setEmailFrom(data.emailTitleFrom)
      setEmailTopic(data.emailTopic)
      setPort(data.port)
    }

    const setEmailTemplates = (data) => {
        
        data.forEach(d => {
            if(d.for == "Admin")
            {
                setAdminTemplate(d.text)
            }else if(d.for == "Participant")
            {
                setSelectedSurveys(d.surveys)
                setParticipantTemplate(d.text)
            }else if(d.for == "Reminder")
            {
              setReminderTemplate(d.text)
            }
        })
    }

    const sendTestEmail = () => {
      saveEmailSettings( () => {
        Axios({
          method: "GET",
          withCredentials: true,
          url: process.env.REACT_APP_API_BASE + "/sendTestMail",})
        .then((res) => alert(res.data))
      });
      
    }
  
    if(loading)
    {
      return <Loading/>
    }

  return (
    <div className="EmailSettings">
        <Sidebar/>
        <div className="EmailSettingsContainer">
            <div className="top">
                <div className="title">
                    Email Settings
                </div>
            </div>
            <div className="center">
                <div className="userEmailSettings">
                    <div className="textField">
                      <TextField
                          id="outlined-multiline-static"
                          label="Email Template for Booking"
                          multiline
                          rows={10}
                          fullWidth
                          value={participantTemplate}
                          onChange={(e) => setParticipantTemplate(e.target.value)}
                          
                      />
                    </div>
                    
                    <div className="textField">
                      <TextField
                          id="outlined-multiline-static"
                          label="Email Template for Reminder"
                          multiline
                          rows={10}
                          fullWidth
                          value={reminderTemplate}
                          onChange={(e) => setReminderTemplate(e.target.value)}
                          
                      />
                    </div>
                      <MultipleSelectChip selectedSurveys={selectedSurveys} setSelectedSurveys={setSelectedSurveys}/>
                    
                    
                </div>
                
                <div className="adminEmailSettings">
                  <div className="textField">
                    <TextField
                          id="outlined-multiline-static"
                          label="Email Template for Admin"
                          multiline
                          rows={10}
                          fullWidth
                          value={adminTemplate}
                          onChange={(e) => setAdminTemplate(e.target.value)}
                          
                      />
                  </div>
                  <div className="settings">
                    <div className="inputFields">
                      <div className="container">
                        <div className="host">
                          <TextField
                                id="outlined-multiline-static"
                                label="SMTP Host"
                                value={emailHost}
                                onChange={(e) => setEmailHost(e.target.value)}
                                
                          />
                          <TextField
                                id="outlined-multiline-static"
                                label="SMTP Port"
                                value={port}
                                onChange={(e) => setPort(e.target.value)}
                                
                          />
                        </div>
                        
                        <TextField
                              id="outlined-multiline-static"
                              label="Email Username"
                              fullWidth
                              value={emailUsername}
                              onChange={(e) => setEmailUsername(e.target.value)}
                              
                        />
                        <PasswordField password={emailPassword} setPassword={setEmailPassword}/>
                        
                      </div>
                      <div className="container">
                        <TextField
                              id="outlined-multiline-static"
                              label="Email From"
                              fullWidth
                              value={emailFrom}
                              onChange={(e) => setEmailFrom(e.target.value)}
                              
                        />
                        <TextField
                              id="outlined-multiline-static"
                              label="Email Topic"
                              fullWidth
                              value={emailTopic}
                              onChange={(e) => setEmailTopic(e.target.value)}
                              
                        />
                        <TextField
                              id="outlined-multiline-static"
                              label="Admin Email"
                              fullWidth
                              value={adminEmail}
                              onChange={(e) => setAdminEmail(e.target.value)}
                              
                        />
                        
                      </div>
                    </div>
                    <div className="testButton">
                      <Button variant="contained" onClick={() => sendTestEmail()}>Send Test Email to Admin</Button>
                    </div>
                    
                    
                  </div>
                </div>
                <Button variant="contained" color="success" onClick={() => UpdateData()}>Update Settings</Button>
            </div>
        </div>
    </div>
  )
}

export default EmailSettings


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

function MultipleSelectChip({selectedSurveys, setSelectedSurveys}) {
  const theme = useTheme();
  const [surveys, setSurveys] = useState([])
  const [personName, setPersonName] = React.useState([]);

  const GetSurveys = () => {
    Axios({
        method: "GET",
        withCredentials: true,
        url: process.env.REACT_APP_API_BASE + "/getSurveys",})
    .then((res) => {res.data.forEach(d => d = d.title); console.log(res.data);createSurveyDropdown(res.data)})
}

    const createSurveyDropdown = (data) => {
        data.forEach(d => {
            setSurveys(surveys => [...surveys, d.title]);
        })
    } 


  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedSurveys(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  useEffect(() => {
    GetSurveys();
  }, [])

  return (
    <div className="select">
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="demo-multiple-chip-label">Surveys to take before the Interview</InputLabel>
        <Select
          labelId="demo-multiple-chip-label"
          id="demo-multiple-chip"
          multiple
          value={selectedSurveys}
          onChange={handleChange}
          input={<OutlinedInput id="select-multiple-chip" label="Surveys to take before the Interview" />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {surveys.map((name) => (
            <MenuItem
              key={name}
              value={name}
              style={getStyles(name, personName, theme)}
            >
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}


function PasswordField({password, setPassword}){

  const [showPassword, setShowPassword] = useState(false)

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
  <FormControl  variant="outlined">
      <InputLabel htmlFor="outlined-adornment-password">Email Password</InputLabel>
      <OutlinedInput
        id="outlined-adornment-password"
        type={showPassword ? 'text' : 'password'}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={() => setShowPassword(!showPassword)}
              onMouseDown={handleMouseDownPassword}
              edge="end"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        }
        label="Email Password"
      />
  </FormControl>
  )
}