import "./createsurvey.scss"
import Sidebar from "../../../components/sidebar/Sidebar"


import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Button from '@mui/material/Button';

import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

import { useEffect, useState } from "react"
import Axios from "axios";

function Createsurvey() {

  const [questions, setQuestions] = useState([])
  const [title, setTitle] = useState()

  const surveyID = window.location.pathname.split("/").pop() === "create" ? null : window.location.pathname.split("/").pop()

  const GetSurvey = () => {
    
    if(surveyID)
    {
      Axios({
        method: "GET",
        withCredentials: true,
        params:{
            id: window.location.pathname.split("/").pop()
        },
        url: process.env.REACT_APP_API_BASE + "/getSurvey",})
    .then((res) => jsonToQuestions(res.data.json))
    }
    
  }

    useEffect(() => {
      GetSurvey();
      // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])


  const removeQuestion = (id) => {
    setQuestions([...questions.filter((_,index) => index !== (id))]);
  }

  const updateSurvey = (question,id) => {
      var updateSurvey = [...questions]
      updateSurvey[id] = question
      setQuestions(updateSurvey);
  }

  

  const convertToJson = () => {
    var json = '{ "title": "'+title+'", "logoPosition": "right", "pages": [{ "name": "page1", "elements": [ { "type": "text", "name": "Participant ID", "isRequired": true },'
    questions.forEach(question => {
        json += JSON.stringify(question).toString();
        if(questions.indexOf(question) !== questions.length -1)
        {
            json += ","
        }
    })
    json += '] } ] }'
    saveSurveyToDatabase(json,title)
      
}

  const jsonToQuestions = (json) => {
    var obj = JSON.parse(json);
    setTitle(obj.title)
    setQuestions(obj.pages[0].elements.slice(1));
  }

  const saveSurveyToDatabase = (json, title) => {
    Axios({
        method: "POST",
        data: {
            json: json,
            title: title,
            id: surveyID
        },
        withCredentials: true,
        url: process.env.REACT_APP_API_BASE+"/setSurvey",
      }).then(res => {
          window.location = "/survey"
      }) ;
  }

  return (
    <div className="createsurvey">
      <Sidebar/>
      <div className="createsurveyContainer">
        <div className="top">
          <div className="title">
            {surveyID ? "Edit Survey" : "Create new Survey"}
          </div>
        </div>
        <div className="middle">
        <div className="surveyTitle">
          <Box component="form" sx={{ '& > :not(style)': { m: 1, width: '25ch' }, }} noValidate autoComplete="off" >
            <TextField label="Survey Title" variant="outlined" onChange={(e) => setTitle(e.target.value)} value={title || ''}/>
          </Box>
        </div>
        <div className="questionContainer">
          <form className="questionForm">
          <div className="question" key={"Participant ID"}>
            <FormControl className="questionForm" sx={{ m: 1, minWidth: 200 }}>
            <InputLabel id="demo-simple-select-label">Question Type</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Question Type"
                value="text"
                disabled
              >
                  <MenuItem value="text">Single Input</MenuItem>
              </Select>
            </FormControl>
              <FormControlLabel control={<Checkbox checked={true}> </Checkbox>} label="Required" disabled/>
              <Box component="form" sx={{ '& > :not(style)': { m: 1, width: '25ch' }, }} noValidate autoComplete="off" >
                  <TextField label="Question" variant="outlined" name="Question" value={"Participant ID"} disabled/>
              </Box>
            </div>
          </form>
        </div>
        {
          questions.map((question,id) => {
              return (
              <div className="questionContainer">
                  <form className="questionForm" onChange={() => updateSurvey(question,id)}>
                      <SurveyCreation question={question} id={id}/>
                  </form>
                  <Button className="deleteButton" startIcon={<DeleteIcon/>} variant="outlined" color="error" onClick={() => removeQuestion(id)}>Delete</Button>
              </div>)
            })
         }
         <Button className="button" variant="outlined"  startIcon={<AddIcon/>} onClick={() => setQuestions([...questions,{ type:"text" ,name:"Question"}])}>Add Question</Button>
         </div>
        <div className="bottom">
          <div className="buttonContainer">
            <Button className="button" color="success" variant="contained" onClick={() => {convertToJson()}}>Save Survey</Button>
            <Button className="button" color="error" variant="contained" onClick={() => {window.location.href = "/survey"}}>Cancel Changes</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Createsurvey


const SurveyCreation = ({question,id}) => {
  const [type, setType] = useState(question.type)
  return (
   <div className="question" key={id}>
    <FormControl className="questionForm" sx={{ m: 1, minWidth: 200 }}>
    <InputLabel id="demo-simple-select-label">Question Type</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={type}
        label="Question Type"
        onChange={(e) => {question.type = e.target.value; setType(e.target.value)}}
      >
          <MenuItem value="text">Single Input</MenuItem>
          <MenuItem value="checkbox">Checkbox</MenuItem>
          <MenuItem value="radiogroup">Radiogroup</MenuItem>
          <MenuItem value="dropdown">Dropdown</MenuItem>
          <MenuItem value="comment">Comment</MenuItem>
          <MenuItem value="rating">Rating</MenuItem>
          <MenuItem value="ranking">Ranking</MenuItem>
          <MenuItem value="boolean">Boolean</MenuItem>
      </Select>
    </FormControl>
      <FormControlLabel control={<Checkbox checked={question.isRequired || false} onChange={(e) => question.isRequired = e.target.checked}> </Checkbox>} label="Required" />
      <SurveyQuestion type={question.type} question={question}></SurveyQuestion>
   </div>
  )
}


const SurveyQuestion = ({type,question}) => {
  switch(type){
      case 'text':
          return <QuestionInput question={question}/>
      case 'checkbox':
          return (
              <div className="answersContainer">
                  <QuestionInput question={question}/>
                  <AnswersInput question={question} label={"Checkboxes"}/>
              </div>
          )
      case 'radiogroup':
          return (
            <div className="answersContainer">
              <QuestionInput question={question}/>
              <AnswersInput question={question} label={"Radiobuttons"}/>
            </div>
          )
      case 'dropdown':
          return (
            <div className="answersContainer">
              <QuestionInput question={question}/>
              <AnswersInput question={question} label={"Dropdowns"}/>
            </div>
          )
      case 'comment':
          return <QuestionInput question={question}/>
      case 'rating':
          return (
              <div className="answersContainer">
                  <QuestionInput question={question}/>
                  <RatingInput question={question} label={"Max Value"}/>
              </div>
          )
      case 'boolean':
          return <QuestionInput question={question}/>
      case 'ranking':
          return (
            <div className="answersContainer">
                <QuestionInput question={question}/>
                <AnswersInput question={question} label={"Rankings"}/>
            </div>
          )
      default:
          return <p>NONE</p>
  }
}


const QuestionInput = ({question}) => {
  return(
    <Box component="form" sx={{ '& > :not(style)': { m: 1, width: '25ch' }, }} noValidate autoComplete="off" >
        <TextField label="Question" variant="outlined" onChange={(e) => question.name = e.target.value} name="Question" value={question.name}/>
    </Box>
  )
}

const AnswersInput = ({question, label}) => {
  return(
    <Box component="form" sx={{ '& > :not(style)': { m: 1, width: '25ch' }, }} noValidate autoComplete="off" >
        <TextField label={label} variant="outlined" onChange={(e) => question.choices = e.target.value.split(',')} name={label} value={question.choices}/>
    </Box>
  )
}

const RatingInput = ({question, label}) => {
  return(
    <Box component="form" sx={{ '& > :not(style)': { m: 1, width: '25ch' }, }} noValidate autoComplete="off" >
        <TextField label={label} variant="outlined" onChange={(e) => question.rateMax = e.target.value} name={label} value={question.rateMax}/>
    </Box>
  )
}