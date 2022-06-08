import "./timesettings.scss"

import Sidebar from "../../components/sidebar/Sidebar"
import Loading from "../../components/loading/Loading"

import AvailableTimes from 'react-available-times';

import Axios from "axios";
import {useEffect, useState} from 'react';

function Timesettings() {

    const [slotTimes, setSlotTimes] = useState([])
    const [loading, setLoading] = useState(true) 


    const updateSlot = (start, end) => {
        Axios({
              method: "POST",
              withCredentials: true,
              url: process.env.REACT_APP_API_BASE+"/setTimes",
              data: {
                  start:start,
                  end: end
              },
            });
    }

    const deleteTimes = () => {
        Axios({
            method: "POST",
            withCredentials: true,
            url: process.env.REACT_APP_API_BASE+"/deleteTimes",
          });
    }

    const getSlots = () => {
        Axios({
            method: "GET",
            withCredentials: true,
            url: process.env.REACT_APP_API_BASE+"/slots",
          })
          .then((res) => {  
            setSlotTimes(res.data)
            setLoading(false)
        })
    }

    useEffect(() => {
        getSlots();
    },[])

    if(loading)
    {
        return <Loading/>
    }

  return (
    <div className="timesettings">
        <Sidebar/>
        <div className="timesettingsContainer">
        <div className="infoContainer">
                <div className="title">
                    Info
                </div>
                <div className="info">
                    Meetings that are already booked will not get deleted!
                </div>
            </div>
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
            onChange={(selections) => {
                deleteTimes();
                selections.forEach(({ start, end }) => {
                    updateSlot(start, end);
                })
              }}
            height={650}
            recurring={true}
            initialSelections={slotTimes}
            availableDays={['monday', 'tuesday', 'wednesday', 'thursday', 'friday']}
            availableHourRange={{ start: 9, end: 19 }}
            />
        </div>
    </div>
  )
}

export default Timesettings