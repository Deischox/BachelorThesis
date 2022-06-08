import "./surveyresults.scss"

import Sidebar from "../../../components/sidebar/Sidebar"
import Datatable from "../../../components/datatable/Datatable"
import Loading from "../../../components/loading/Loading"

import Button from '@mui/material/Button';
import DownloadIcon from '@mui/icons-material/Download';

import Axios from "axios"
import { useState, useEffect } from "react";
import surveyResultsTable from "../../../utils/tableStyles/surveyresultsTable"

import JSZip from "jszip";

function Surveyresults() {

  const [surveyresults, setSurveyresults] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    GetSurveyResults();
  }, [])

  const GetSurveyResults = () => {
    Axios({
        method: "GET",
        withCredentials: true,
        url: process.env.REACT_APP_API_BASE + "/getSurveyResults",})
    .then((res) => res.data)
    .then(data => {data.forEach(d => d.id = d._id); setSurveyresults(data);setLoading(false)})
    .catch(err => console.error(err))
}

const DownloadAll = (type) => 
  {
    var zip = new JSZip();
    
    var zipFiles = new Promise((resolve, reject) => {
      var i = 0;
      surveyresults.forEach((survey) => {
        // Create a blob with the data we want to download as a file
        const blob = new Blob([JSON.stringify(survey.json)], { type: "text/json" })
        zip.file(survey.userID + "_" + survey.title + type, blob)
        i += 1;
        if(i === surveyresults.length)
        {
          resolve()
        }
      })
    })
      
      zipFiles.then(() => {
        zip.generateAsync({type:"base64"}).then(function (base64) {
          window.location = "data:application/zip;base64," + base64;
        })

      })
  }

  if(loading)
  {
    return <Loading/>
  }

  return (
    <div className="surveyresults">
        <Sidebar/>
        <div className="surveyresultsContainer">
          <div className="buttonContainer">
            <Button className="button" variant="outlined"  startIcon={<DownloadIcon/>} onClick={() => DownloadAll(".json")}>Download All as JSON</Button>
            <Button className="button" variant="outlined"  startIcon={<DownloadIcon/>} onClick={() => DownloadAll(".csv")}>Download All as CSV</Button>
          </div>
          <Datatable columns={surveyResultsTable} rows={surveyresults}/>
        </div>
    </div>
  )
}

export default Surveyresults