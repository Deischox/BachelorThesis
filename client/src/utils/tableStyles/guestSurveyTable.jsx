import { Link } from "react-router-dom";

const guestSurveyTable = [
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
            <Link
            to={`/survey/${params.row.id}`}
            style={{ textDecoration: "none" }}
            >
            <div className="viewButton">Take Survey</div>
          </Link>
        </div>
      );
    },
  },
];


export default guestSurveyTable