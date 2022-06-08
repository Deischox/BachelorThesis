import "./meetings.scss"

import Sidebar from "../../components/sidebar/Sidebar"
import Loading from "../../components/loading/Loading"


import Datatable from "../../components/datatable/Datatable"
import AvailableTimes from 'react-available-times';

import meetingsTable from "../../utils/tableStyles/meetingsTable"

import { useState, useEffect } from "react";

import Axios from "axios"

function Meetings() {

  const [meetings, setMeetings] = useState([])  
  const [bookedSlots, setBookedSlots] = useState([])

  const [loading, setLoading] = useState(true) 

  useEffect(() => {
      GetMeetings();
      getBookedSlots();
  }, [])

  useEffect(() => {
  },[bookedSlots])

const GetMeetings = () => {
  Axios({
      method: "GET",
      withCredentials: true,
      url: process.env.REACT_APP_API_BASE + "/getInterviews",})
  .then((res) => res.data)
  .then(data => {data.forEach(d =>{ 
    d.id = d._id; 
    if(new Date(d.date) >= new Date()){
      setMeetings(meetings => [...meetings,d] )
    }
  }); 
  })
  .catch(err => console.error(err))
}

const getBookedSlots = async () => {
  Axios({
      method: "GET",
      url: process.env.REACT_APP_API_BASE+"/getBookedSlots",
    })
    .then((res) => { 
      res.data.forEach((data) => {
        if(new Date(data._id.date) >= new Date())
        {
          setBookedSlots(bookedSlots => [...bookedSlots, {start: data._id.slot, end: (parseInt(data._id.slot)+parseInt(process.env.REACT_APP_INTERVIEW_TIME))}])
        }
      })
      setLoading(false);
  })
}

  if(loading)
  {
    return <Loading/>
  }

  return (
    <div className="meetings">
        <Sidebar/>
        <div className="meetingsContainer">
            <div className="left">
                <Datatable columns={meetingsTable} rows={meetings} getRowId={(row) => row._id}/>
            </div>
            <div className="right">
              <AvailableTimes
              weekStartsOn="monday"
              calendars={[
                  {
                  id: 'work',
                  title: 'Work',
                  foregroundColor: '#ff00ff',
                  backgroundColor: '#f0f0f0',
                  selected: true,
                  }
              ]}
              height={650}
              recurring={true}
              initialSelections={bookedSlots}
              availableDays={['monday', 'tuesday', 'wednesday', 'thursday', 'friday']}
              availableHourRange={{ start: 9, end: 19 }}
              />
            </div>
        </div>
    </div>
  )
}

export default Meetings