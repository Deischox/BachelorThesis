import Axios from "axios"

const DownloadVideo = (name) => {
  name.forEach((file) => {
    Axios({
      method: "GET",
      withCredentials: true,
      responseType: 'blob', // important
      url: process.env.REACT_APP_API_BASE + "/videos/download/"+file.title,})
    .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', file.title+'.mp4'); //or any other extension
        document.body.appendChild(link);
        link.click();
    })
    .catch(err => console.error(err))
  })
  
}


const downloadFile = (user, surveys) => {
  surveys.forEach((survey) => {
      // Create a blob with the data we want to download as a file
      const blob = new Blob([JSON.stringify(survey.json)], { type: "text/json" })
      // Create an anchor element and dispatch a click event on it
      // to trigger a download
      const a = document.createElement('a')
      a.download = user + "_" + survey.title+".json"
      a.href = window.URL.createObjectURL(blob)
      const clickEvt = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true,
      })
      a.dispatchEvent(clickEvt)
      a.remove()
  })
  
}

const viewVideo = (id) => {
  let a= document.createElement('a');
  a.target= '_blank';
  a.href= process.env.REACT_APP_API_BASE + "/video/watch/"+id;
  a.click();
}

const writeEmail = (email) => {
  let a= document.createElement('a');
  a.target= '_blank';
  a.href= "mailto: "+email;
  a.click();
}

const viewFile = (surveys) => {
  var viewJson = window.open();
  viewJson.document.open();
  viewJson.document.write('<html><body>');
  viewJson.document.close();
  surveys.forEach((survey) => {
    var myjson = JSON.stringify(survey, null, 2);
    viewJson.document.write('<pre>'+myjson+'</pre>');
  })
  viewJson.document.write('</body></html>')
  viewJson.document.close();
  
  
}

const participantTable = [
  { field: "id", headerName: "ID", flex: 1 },
  { field: "Age", headerName: "Age", flex: 0.5 },
  { field: "Gender", headerName: "Gender", flex: 1 },
  { field: "Nationality", headerName: "Nationality", flex: 1 },
  { field: "interviewDate", headerName: "Interview", flex: 1 },
  { field: "surveyIndex", headerName: "Survey", flex: 1,
  renderCell: (params) => {
    return params.row.surveyIndex >= 0 ? 
    <div className="cellAction">
      <div className="viewButton" onClick={() => viewFile(params.row.surveyName)}>View</div>
      <div className="downloadButton" onClick={() => downloadFile(params.row.id, params.row.surveyName)}>Download</div>
    </div> : ""
    } },
  { field: "videoIndex", headerName: "Video", flex: 1, 
  renderCell: (params) => {
    return params.row.videoIndex >= 0 ? 
    <div className="cellAction">
      <div className="viewButton" onClick={() => viewVideo(params.row.id)}>View</div>
      <div className="downloadButton"  onClick={() => DownloadVideo(params.row.videoName)}>Download</div>
    </div> : ""
    } },
    { field: "Email", headerName: "Email", flex: 1,
  renderCell: (params) => {
    return params.row.Email ? <div className="cellAction">
      <div className="viewButton" onClick={() => writeEmail(params.row.Email)}>Write Email</div>
    </div> : params.row.Email
    } },
];


export default participantTable