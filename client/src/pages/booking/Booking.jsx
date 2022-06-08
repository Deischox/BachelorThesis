/* eslint-disable no-loop-func */
import "./booking.scss"

import {useEffect, useState, useCallback} from 'react';
import Axios from "axios";
import "survey-react/modern.min.css";
import { Survey, StylesManager, Model } from "survey-react";
import json from "../../utils/files/BookingForm.json"

import Sidebar from "../../components/sidebar/Sidebar"

function Booking() {

    const interviewTime = process.env.REACT_APP_INTERVIEW_TIME;
    const [slots, setSlots] = useState([])
    const [bookedSlots, setBookedSlots] = useState([])
    const [meetingBooked, setMeetingBooked] = useState(false)
    const [meeting, setMeeting] = useState()

    const convertNumbersToTime = (times) => {
        let sorted = times.sort((a,b) => (slotToDate(a.start) - slotToDate(b.start)))
        sorted.forEach((slot) => {
            let amount = parseFloat((slot.end-slot.start)/interviewTime)
            for(let i = 0; i < amount; i++)
            {
                const newSlot = slot.start+i*interviewTime;
                var free = true
                const today = new Date()
                bookedSlots.forEach(b => {

                if(new Date(b._id.date) > today && newSlot == b._id.slot)
                {
                    free = false
                }
                }
                )
                if(free)
                {
                    setSlots(slots => [...slots, {date: slotToDate(newSlot).toLocaleString(), slot: newSlot}])
                }
                
            }
        })
    }
 
    const slotToDate = (slot) => {
        var now = new Date();
        var next_week_start = new Date(now.getFullYear(), now.getMonth(), now.getDate()+(8 - now.getDay()));
        const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() + 1)

        if(new Date(startOfWeek.getTime() + slot*60000) < now || new Date(startOfWeek.getTime() + slot*60000).getDate() == now.getDate())
        {
            return new Date(next_week_start.getTime() + slot*60000);
        }
        
        return new Date(startOfWeek.getTime() + slot*60000);
        
    }

    const getAllSlots = () => {
        Axios({
            method: "GET",
            url: process.env.REACT_APP_API_BASE+"/slots",
          })
          .then((res) => {  
            setSlots([])
            convertNumbersToTime(res.data)
        })
    }

    const getUserBookedSlots = async (userID) => {
        let bookedMeeting = false;
        await Axios({
            method: "GET",
            params:{
                user: userID
            },
            url: process.env.REACT_APP_API_BASE+"/getUserInterview",
          })
          .then((res) => {   
            if(res.data.date)
              {
                setMeeting(res.data.date)
                bookedMeeting = true;
              }
        })
        return bookedMeeting
    }
    

    const getBookedSlots = async () => {
        Axios({
            method: "GET",
            url: process.env.REACT_APP_API_BASE+"/getBookedSlots",
          })
          .then((res) => {  
            setBookedSlots(res.data)
            
        })
    }


    const bookMeeting = useCallback((sender) => {
        getUserBookedSlots(sender.data.id).then((res) => {
            if(!res)
            {
                GetTimes(sender)
            }
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const GetTimes = (sender) => {
        
        var offsetDate = new Date();
        var offset = offsetDate.getTimezoneOffset();
        Axios({
            method: "POST",
            data: {
                date: slotToDate(sender.data.slot),
                slot: sender.data.slot,
                user: sender.data.id,
                email: sender.data.email,
                offset: offset
            },
            url: process.env.REACT_APP_API_BASE+"/setInterview",
            }).then(res => {
                if(res.status === 200)
                {
                    setMeetingBooked(true)
                    CreateParticipant(sender.data.id, sender.data.email);
                }
            }) ;
    }

    const CreateParticipant = (userID, email) => {
        Axios({
            method: "POST",
            data: {
                ParticipantId: userID,
                Email: email,
            },
            url: process.env.REACT_APP_API_BASE+"/createParticipant",
            })
        };
   
    useEffect(() => {
        getBookedSlots()
    },[]);

    useEffect(() => {
        getAllSlots()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[bookedSlots]);

    useEffect(() => {
        var s = []
        var used = []
        slots.forEach(slot => {
            if(!used.includes(slot.slot))
            {
                used.push(slot.slot)
                s.push({'value': slot.slot, 'text': slot.date})
            }
        })
        json.pages[0].elements[2].choices = s
    }, [slots])


    const survey = new Model(json);
    survey.focusFirstQuestionAutomatic = true;
    StylesManager.applyTheme("modern");
    survey.onComplete.add(bookMeeting);

    if(meeting){
        return (
            <div className="booking">
                <Sidebar/>
                <div className="bookingContainer">
                    <h1>You already have a meeting booked: {new Date(meeting).toLocaleString()}</h1>
                </div>
            </div>
        )
    }

    if(meetingBooked)
    {
        return ( 
            <div className="booking">
                <Sidebar/>
                <div className="bookingContainer">
                    <h1>Thank you for booking a meeting!</h1>
                </div>
            </div>
           
        )
    }

  return (
    <div className="booking">
        <Sidebar/>
        <div className="bookingContainer">
            <Survey model={survey} />;
        </div>
    </div>
  )
}

export default Booking