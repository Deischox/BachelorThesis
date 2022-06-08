import "./videocall.scss"

import Sidebar from "../../components/sidebar/Sidebar"
import Videoplayer from "../../components/videoplayer/Videoplayer"
import Popup from "../../components/popup/Popup"

import recordStyle from "../../utils/popupStyles/Recordings"

import{ useEffect, useContext, useState} from "react"

import Axios from "axios";
import { SocketContext } from "../../utils/context/SocketContext"

import { isLoggedIn } from "../../utils/helper/fetchBackend"

function Videocall({setConnected}) {

  const {connectPeerJs,connectToSocket,video, chat, sendMessage, myID, getVideo, muteUser, stopVideo, leaveRoom, currentCall, recording} = useContext(SocketContext)

  const [username, setUsername] = useState()
  const [chatMessage, setChatMessage] = useState()
  const [muted, setMuted] = useState(false)
  const [videoStopped, setVideoStopped] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [popup, setPopup] = useState(false)

  const [record, setRecord] = useState('participant')


  const [loading, setLoading] = useState(true)

  const [logedin, setLogedin] = useState(localStorage.getItem('logedIn') === "true")

  useEffect(() => {
    setTimeout(function () {
      isLoggedIn().then(res => setLogedin(res))
      getUsername();
      getVideo()
      .then(connectPeerJs()
      .then(connectToSocket()))
    }, 10);
  }, [])

  useEffect(() => {
    const chatDiv = document.getElementById('chat-container')
    if(chatDiv)
    {
      chatDiv.scrollTop = chatDiv.scrollHeight;
    }
  }, [chat])




  const getUsername = () => {
    Axios({
      method: "GET",
      withCredentials: true,
      url: process.env.REACT_APP_API_BASE+"/user",
    })
    .then((res) => {
      if(res.data.username === undefined)
      {
        setUsername("anonymous")
      }  else{

        setUsername(res.data.username)
      }});
  }

  const handleRecording = () => {
    if(isRecording){
      recording(record)
      setIsRecording(false);
    }else{
      setPopup(true);
    }
  }
  


  return (
    <div className="videocall">
      <Sidebar/>
      <div className="videocallContainer">
      <Popup 
      show={popup} 
      message={recordStyle({record: record, setRecord: setRecord})} 
      title="Recording" 
      changePopupState={setPopup}
      acceptFunction={() => {recording(record); setIsRecording(true);}}
      acceptTitle="Start Recording"
      denyTitle="Cancel"
      />

        <div className="left">
          <div className="top">
            <Videoplayer call={currentCall} videoref={video}/>
          </div>
          <div className="bottom">
            <div className="settingsBar">
              <button className="settingsButton leave" onClick={() => {leaveRoom();  window.location.href = "/room";}}>Leave</button>
              <button className="settingsButton audio" onClick={() =>{ setMuted(!muted); muteUser(muted)}}>{muted ? "Unmute" : "Mute"}</button>
              
              {logedin ? <>
              <button className="settingsButton audio" onClick={() => { setVideoStopped(!videoStopped); stopVideo(videoStopped)}}>{videoStopped ? "Start Camera" : "Stop Camera"}</button>
              <button className="settingsButton camera" disabled={currentCall === null} onClick={() =>{ handleRecording()}}>{isRecording ? "Stop Recording" : "Start Recording"}</button> 
              </>: 
              <button className="settingsButton camera" onClick={() => { setVideoStopped(!videoStopped); stopVideo(videoStopped)}}>{videoStopped ? "Start Camera" : "Stop Camera"}</button>}
              
            </div>
          </div>
        </div>
        <div className="right">
          <div className="chatContainer">
            <div className="top">
              <div className="title">
                Room Chat
              </div>
            </div>
          <div className="middle">
            <div className="chat" id="chat-container">
                {chat.map((m) => {
                return <ChatMessage from={m.name} message={m.message} id={m.from} me={myID}/>
              })}
            </div>
            </div>
          <div className="bottom">
            <div className="chatBar">
              <input type="text" className="chatInput" value={chatMessage} onChange={(e) => setChatMessage(e.target.value)} placeholder="Message..."/>
              <button className="sendButton" onClick={() => {sendMessage(chatMessage, username); setChatMessage('')}}>Send</button>
            </div>
          </div>
          </div>
          
        </div>
      </div>
    </div>
  )
}


function ChatMessage({from, message, id, me}){
  return (
    <div className={id === me ? "me message" : id === "SERVER" ? "server" : "message"}>
      <div className="top">
        <div className="user">
          {from}
        </div>
      </div>
      <div className="bottom">
        <div className="text">
          {message}
        </div>
      </div>
    </div>
  )
}

export default Videocall