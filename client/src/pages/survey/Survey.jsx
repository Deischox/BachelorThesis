import "./survey.scss"

import Sidebar from "../../components/sidebar/Sidebar"
import Datatable from "../../components/datatable/Datatable"
import Loading from "../../components/loading/Loading"

import surveyTable from "../../utils/tableStyles/surveyTable"

import { useState, useEffect } from "react";
import Axios from "axios"

function Survey() {

  const [surveys, setSurveys] = useState([])
  const [loading, setLoading] = useState([])


  
  useEffect(() => {
      GetSurveys();
  }, [])

  const GetSurveys = () => {
      Axios({
          method: "GET",
          withCredentials: true,
          url: process.env.REACT_APP_API_BASE + "/getSurveys",})
      .then((res) => {res.data.forEach(d => d.id = d._id); setSurveys(res.data)})
      .then(setLoading(false))
  }

  if(loading)
  {
    return <Loading/>
  }

  return (
    <div className="survey">
        <Sidebar/>
        <div className="surveyContainer">
            <Datatable columns={surveyTable} rows={surveys}/>
        </div>
    </div>
  )
}

export default Survey