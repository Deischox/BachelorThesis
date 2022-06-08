import Axios from "axios"

const downloadFile = (user,json,title, type) => {
        // Create a blob with the data we want to download as a file
        const blob = new Blob([JSON.stringify(json)], { type: "text/json" })
        // Create an anchor element and dispatch a click event on it
        // to trigger a download
        const a = document.createElement('a')
        a.download = user+ "_" + title+type
        a.href = window.URL.createObjectURL(blob)
        const clickEvt = new MouseEvent('click', {
          view: window,
          bubbles: true,
          cancelable: true,
        })
        a.dispatchEvent(clickEvt)
        a.remove()
  }

const viewFile = (json) => {
  var myjson = JSON.stringify(json, null, 2);
  var viewJson = window.open();
  viewJson.document.open();
  viewJson.document.write('<html><body><pre>'+myjson+'</pre></body></html>');
  viewJson.document.close();
}

const DeleteResult = (id) => {
  Axios({
      method: "POST",
      withCredentials: true,
      data: {
        id: id,
      },
      url: process.env.REACT_APP_API_BASE + "/deleteSurveyResult",})
  .then((res) => {window.location.reload(false)})
  .catch(err => console.error(err))
}


const surveyResultsTable = [
    { field: "userID", headerName: "User", flex: 1 },
    { field: "title", headerName: "Survey Title", flex: 1 },
    { field: "action", headerName: "Action", flex: 1,
    renderCell: (params) => {
        return <div className="cellAction">
            <div className="viewButton" onClick={() => viewFile(params.row.json)}>View</div>
            <div className="downloadButton" onClick={() => downloadFile(params.row.userID, params.row.json, params.row.title, ".json")}>Download as JSON</div>
            <div className="downloadButton" onClick={() => downloadFile(params.row.userID, params.row.json, params.row.title, ".csv")}>Download as CSV</div>
            <div className="deleteButton" onClick={() => DeleteResult(params.row.id)}>Delete</div>
        </div> 
        } },
]

export default surveyResultsTable