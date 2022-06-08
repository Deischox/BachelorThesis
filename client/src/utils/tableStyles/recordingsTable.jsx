import Axios from "axios"

const DownloadVideo = (name) => {
    Axios({
        method: "GET",
        withCredentials: true,
        responseType: 'blob', // important
        url: process.env.REACT_APP_API_BASE + "/videos/download/"+name,})
    .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', name+'.webm'); //or any other extension
        document.body.appendChild(link);
        link.click();
    })
    .catch(err => console.error(err))
}

const DeleteVideo = (name) => {
    Axios({
        method: "POST",
        withCredentials: true,
        url: process.env.REACT_APP_API_BASE + "/videos/"+name+"/delete",})
    .then((res) => {window.location.reload(false)})
    .catch(err => console.error(err))
}

const viewVideo = (id) => {
    let a= document.createElement('a');
    a.target= '_blank';
    a.href= process.env.REACT_APP_API_BASE + "/video/watch/"+id;
    a.click();
}

const recordingsTable = [
    { field: "title", headerName: "File Title", flex: 1 },
    { field: "userID", headerName: "User", flex: 1 },
    { field: "timestamp", headerName: "Date", flex: 1, renderCell: (params) => {
        return new Date(parseInt(params.row.timestamp)).toLocaleDateString("de-DE")
        } 
    },
    { field: "action", headerName: "Action", flex: 1,
    renderCell: (params) => {
        return <div className="cellAction">
            <div className="viewButton" onClick={() => viewVideo(params.row.title)}>View</div>
            <div className="downloadButton" onClick={() => DownloadVideo(params.row.title)}>Download</div>
            <div className="deleteButton" onClick={() => DeleteVideo(params.row.id)}>Delete</div>
        </div> 
        } },
]

export default recordingsTable