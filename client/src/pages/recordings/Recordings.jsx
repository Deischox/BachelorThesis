import "./recordings.scss"

import Sidebar from "../../components/sidebar/Sidebar"
import Datatable from "../../components/datatable/Datatable"
import Loading from "../../components/loading/Loading"
import Button from '@mui/material/Button';
import DownloadIcon from '@mui/icons-material/Download';


import recordingsTable from "../../utils/tableStyles/recordingsTable"

import Axios from "axios"
import { useState, useEffect }from "react";

import JSZip from "jszip";

function Recordings() {

  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    GetVideos();
  }, [])

  const GetVideos = () => {
    Axios({
        method: "GET",
        withCredentials: true,
        url: process.env.REACT_APP_API_BASE + "/videos",})
    .then((res) => res.data)
    .then(data => {data.forEach(d => d.id = d._id); setVideos(data)})
    .then(setLoading(false))
    .catch(err => console.error(err))
  }

  const DownloadAll = () => {
    
    var zip = new JSZip();
    
    var zipFiles = new Promise((resolve, reject) => {
      var i = 0;
      videos.forEach((v) => {
        Axios({
          method: "GET",
          withCredentials: true,
          responseType: 'blob', // important
          url: process.env.REACT_APP_API_BASE + "/videos/download/"+v.title,})
        .then((res) => {
          zip.file(v.title+".webm", new Blob([res.data]))
          i += 1;
          if(i === videos.length)
          {
            resolve()
          }
        })
        .catch(err => console.error(err))
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
    <div className="recordings">
        <Sidebar/>
        <div className="recordingsContainer">
          <div className="buttonContainer">
            <Button className="button" variant="outlined"  startIcon={<DownloadIcon/>} onClick={() => DownloadAll()}>Download All</Button>
          </div>
            <Datatable columns={recordingsTable} rows={videos}/>
        </div>
    </div>
  )
}

export default Recordings