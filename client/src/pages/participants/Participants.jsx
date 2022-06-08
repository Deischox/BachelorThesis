import "./participants.scss";

import Sidebar from "../../components/sidebar/Sidebar"
import Datatable from "../../components/datatable/Datatable"
import Loading from "../../components/loading/Loading"

import Button from '@mui/material/Button';
import DownloadIcon from '@mui/icons-material/Download';

import participantsTable from "../../utils/tableStyles/participantsTable"

import Axios from "axios"
import {useState, useEffect} from "react"

import JSZip from "jszip";

function Participants() {


  const [participants, setParticipants] = useState([])
  const [surveyresults, setSurveyresults] = useState([])
  const [interviews, setInterviews] = useState([])
  const [videos, setVideos] = useState([])
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
    

    useEffect(() => {
      GetVideos();
    }, [])

    const GetVideos = async () => {
      Axios({
          method: "GET",
          withCredentials: true,
          url: process.env.REACT_APP_API_BASE + "/videos",})
      .then((res) => res.data)
      .then(data => {setVideos(data); GetSurveyResults();  })
      .catch(err => console.error(err))
  }

  const GetInterviews = () => {
      Axios({
          method: "GET",
          withCredentials: true,
          url: process.env.REACT_APP_API_BASE + "/getInterviews",})
      .then((res) => res.data)
      .then(data => setInterviews(data))
      .then(GetParticipants())
      .catch(err => console.error(err))
  }

  const GetParticipants =  () => {
      Axios({
          method: "GET",
          withCredentials: true,
          url: process.env.REACT_APP_API_BASE + "/getParticipants",})
      .then((res) => res.data)
      .then(data => {setParticipants(data)})
      .then(createParticipantsRow())
      .catch(err => console.error(err))
  }

  const DownloadAll = () => {
    
    var zip = new JSZip();

    var videosZIP = zip.folder("videos")
    var surveysZIP = zip.folder("surveys")
    
    var zipFiles = new Promise((resolve, reject) => {
      var i = 0;
      videos.forEach((v) => {
        Axios({
          method: "GET",
          withCredentials: true,
          responseType: 'blob', // important
          url: process.env.REACT_APP_API_BASE + "/videos/download/"+v.title,})
        .then((res) => {
          videosZIP.file(v.title+".mp4", new Blob([res.data]))
          
          i += 1;
          if(i === videos.length + surveyresults.length)
          {
            resolve()
          }
        })
        .catch(err => console.error(err))
      })

      surveyresults.forEach((survey) => {
        // Create a blob with the data we want to download as a file
        const blob = new Blob([JSON.stringify(survey.json)], { type: "text/json" })
        surveysZIP.file(survey.userID + "_" + survey.title + ".json", blob)
        i += 1;
        if(i === videos.length + surveyresults.length)
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

  const GetSurveyResults = () => {
      Axios({
          method: "GET",
          withCredentials: true,
          url: process.env.REACT_APP_API_BASE + "/getSurveyResults",})
      .then((res) => res.data)
      .then(data => {setSurveyresults(data)})
      .then(() => {GetInterviews()})
      .catch(err => console.error(err))
  }

  useEffect(() => {
    setLoading(true)
    createParticipantsRow()
    setLoading(false)
  },[participants])

  const createParticipantsRow = () => {
    
    participants.forEach( participant => 
      {

        participant.id = participant.ParticipantId;

        const videoIndex = videos.findIndex(video => {
          return video.userID === participant.ParticipantId;
        });
      
        participant.videoIndex = videoIndex;

        const recordings = videos.filter(item => item.userID === participant.ParticipantId)

        participant.videoName = recordings;

        const surveyIndex = surveyresults.findIndex(results => {
            return results.userID === participant.ParticipantId
        })

        const surveys = surveyresults.filter(item => item.userID === participant.ParticipantId)

        participant.surveyName = surveys


        participant.surveyIndex = surveyIndex;

        const interviewIndex = interviews.findIndex(i => {
            return i.user === participant.ParticipantId
        })

        if(interviewIndex >= 0)
        {
            participant.interviewDate = new Date(interviews[interviewIndex].date).toLocaleString("de-DE");
        }else{
            participant.interviewDate = "No interview booked";
        }
        setRows(rows => [...rows,participant])
        
      }
    )
    
  }

  if(loading)
  {
    return <Loading/>
  }

  return (
    <div className="participants">
        <Sidebar/>
        <div className="participantsContainer">
        <div className="buttonContainer">
            <Button className="button" variant="outlined"  startIcon={<DownloadIcon/>} onClick={() => DownloadAll()}>Download All</Button>
        </div>
        <Datatable columns={participantsTable} rows={rows}/>
        </div>
    </div>
  )
}

export default Participants