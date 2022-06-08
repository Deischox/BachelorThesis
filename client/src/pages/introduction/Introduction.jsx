import "./introduction.scss"

import Sidebar from "../../components/sidebar/Sidebar"

import React, {useCallback, useState} from 'react'

import "survey-react/modern.min.css";
import { Survey, StylesManager, Model } from "survey-react";
import Axios from 'axios'
import json from "../../utils/files/Introduction.json"


function Introduction() {

    const [finish, setFinish] = useState(false)

    const CreateParticipant = useCallback((sender) => {
        Axios({
            method: "POST",
            data: {
                ParticipantId: sender.data.ID,
                Age: sender.data.Age,
                Gender: sender.data.Gender,
                Nationality: sender.data.Nationality,
                Consent: sender.data.Consent
            },
            url: process.env.REACT_APP_API_BASE+"/createParticipant",
          }).then(res => setFinish(true))
      }, []);

    StylesManager.applyTheme("modern");
    const survey = new Model(json);
    survey.focusFirstQuestionAutomatic = true;
    survey.onComplete.add(CreateParticipant);
    
  return (
    <div className="introduction">
        <Sidebar/>
        <div className="introductionContainer">
            {finish ? <h1>Thank you for completing the survey</h1> : <Survey model={survey} />}
        </div>
    </div>
  )
}

export default Introduction