import {Link} from "react-router-dom"


const writeEmail = (email) => {
  let a= document.createElement('a');
  a.target= '_blank';
  a.href= "mailto: "+email;
  a.click();
}

const meetingsTable = [
    { field: "user", headerName: "User", flex: 1 },
    { field: "date", headerName: "Date", flex: 1, renderCell: (params) => {
      return new Date(params.row.date).toLocaleString("de-DE")
    } },
    { field: "action", headerName: "Action", flex: 1, renderCell: (params) => {
        return (
          <div className="cellAction">
            <Link
              to={`/room/${params.row.user}`}
              style={{ textDecoration: "none" }}
            >
              <div className="viewButton">Join Room</div>
            </Link>
          </div>
        );
      }, 
    },
    { field: "Email", headerName: "Email", flex: 1,
    renderCell: (params) => {
      return params.row.email ? <div className="cellAction">
        <div className="viewButton" onClick={() => writeEmail(params.row.email)}>Write Email</div>
      </div> : params.row.email
      } },
    
]


export default meetingsTable;