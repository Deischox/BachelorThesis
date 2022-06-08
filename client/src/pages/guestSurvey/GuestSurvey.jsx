import "./guestSurvey.scss"

import Sidebar from "../../components/sidebar/Sidebar"
import Datatable from "../../components/datatable/Datatable"
import Loading from "../../components/loading/Loading"

import guestSurveyTable from "../../utils/tableStyles/guestSurveyTable"


import { useState, useEffect } from "react";
import Axios from "axios"

function GuestSurvey() {

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
    <div className="guestSurvey">
        <Sidebar/>
        <div className="guestSurveyContainer">
            <Datatable columns={guestSurveyTable} rows={surveys}/>
        </div>
    </div>
  )
}

export default GuestSurvey