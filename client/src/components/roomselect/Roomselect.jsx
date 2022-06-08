import "./roomselect.scss"

import { useContext, useState, useRef, useEffect } from "react"

import { SocketContext } from "../../utils/context/SocketContext"

import Sidebar from "../../components/sidebar/Sidebar"
import Popup from "../../components/popup/Popup"
import Videoplayer from "../../components/videoplayer/Videoplayer"


import consent from "../../utils/files/text"

function Roomselect({setConnected}) {

    const {userInRoom} = useContext(SocketContext)

    const [popup, setPopup] = useState(false);
    const [roomId, setRoomId] = useState()

    const query = new URLSearchParams(window.location.search);

    const videoRef = useRef()

    const stream = useRef();

    useEffect(()=> {
        setRoomId(query.get('id') !== null ? query.get('id') : "")
        navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((mediaStream) => {
        stream.current = mediaStream;
          try{
            videoRef.current.srcObject = mediaStream;
          }catch(e)
          {
              console.log(e)
          }
      })

    },[])

    useEffect(() => {
        return () => {
          if (window.location.pathname !== "/room") {
            stopUsingUserCameraAndAudio();
          }
        };
      }, []);

    const stopUsingUserCameraAndAudio = () => {
        if (stream.current !== undefined) {
            stream.current.getTracks().forEach((track) => {
            track.stop();
          });
          stream.current = null;
        }
      };

    const checkForEntry = async () => {
        //await getAmountOfMemberInRoom()
        if(userInRoom >= 2)
        {
            alert("This Room is full!")
        }else{
            //joinRoom(roomId, "")
            window.location.href="/room/"+roomId
        }
    }
    

    return (
        <div className="roomselect">
            <Sidebar/>
            <div className="roomselectContainer">
                
                <Popup 
                show={popup} 
                message={consent.consent} 
                title="Consent" 
                acceptFunction={checkForEntry} 
                changePopupState={setPopup}
                acceptTitle="Accept"
                denyTitle="Deny"
                />

                <div className="top">
                    <Videoplayer call={null} videoref={videoRef}/>
                </div>
                <div className="bottom">
                    <div className="form">
                        <input type="text" value={roomId} placeholder="Participant ID " onChange={(e)=>setRoomId(e.target.value)} className="formInput"/>
                        <button className="joinButton" onClick={() => {setPopup(true)}}>Join</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Roomselect