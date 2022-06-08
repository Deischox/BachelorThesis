import { Link } from "react-router-dom";


import Axios from "axios"

const DeleteSurvey = (id) => {
  Axios({
      method: "POST",
      withCredentials: true,
      data: {
          id: id
      },
      url: process.env.REACT_APP_API_BASE + "/deleteSurvey",})
  .then((res) => {
      window.location.reload(false);
  })
  .catch(err => console.error(err))
}

const surveyTable = [
  { field: "title", headerName: "Title", flex: 1 },
  {
    field: "action",
    headerName: "Action",
    description: "This column has a value getter and is not sortable.",
    sortable: false,
    flex: 3,
    renderCell: (params) => {
      return (
        <div className="cellAction">
          <div className="viewButton" id={`copy-${params.row.id}`} onClick={() => {
            navigator.clipboard.writeText(window.location.href+`/${params.row.id}`)
            document.getElementById(`copy-${params.row.id}`).innerHTML = 'Copied';
            }}>Copy Link</div>
          <Link
            to={`/survey/edit/${params.row.id}`}
            style={{ textDecoration: "none" }}
          >
            <div className="viewButton">Edit</div>
          </Link>
          <Link
            to={`/survey/statistics/${params.row.id}`}
            style={{ textDecoration: "none" }}
          >
            <div className="viewButton">Statistics</div>
          </Link>
          <div className="deleteButton" onClick={() => DeleteSurvey(params.row.id)}>Delete</div>
         
        </div>
      );
    },
  },
];


export default surveyTable