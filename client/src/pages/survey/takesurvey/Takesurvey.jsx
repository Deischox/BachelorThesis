import "./takesurvey.scss"

import {useCallback, useEffect, useState} from 'react'
import Axios from 'axios'
import "survey-react/modern.min.css";
import { Survey, StylesManager, Model } from "survey-react";


import Sidebar from "../../../components/sidebar/Sidebar"

function Takesurvey() {

    const [json, setJson] = useState('')

    const surveyID = window.location.pathname.split("/").pop() === "create" ? null : window.location.pathname.split("/").pop()

    const GetSurvey = () => {
        Axios({
            method: "GET",
            withCredentials: true,
            params:{
                id: surveyID
            },
            url: process.env.REACT_APP_API_BASE + "/getSurvey",})
        .then((res) => {setJson(res.data.json); })
    }

    useEffect(() => {
        GetSurvey();
    },[])

    StylesManager.applyTheme("modern");
    const survey = new Model(json);
    survey.focusFirstQuestionAutomatic = false;
  
    const saveSurveyResults = useCallback((sender) => {
      Axios({
        method: "POST",
        data:{
          userID: sender.data['Participant ID'],
          surveyID: surveyID,
          title: sender.title,
          json: sender.data
        },
        url: process.env.REACT_APP_API_BASE + "/setSurveyResults",})
    }, []);
  
    survey.onComplete.add(saveSurveyResults);

    return (
    <div className="takesurvey">
        <Sidebar/>
        <div className="takesurveyContainer">
            <Survey model={survey} />
        </div>
    </div>
  )
}

export default Takesurvey