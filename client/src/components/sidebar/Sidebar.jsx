import "./sidebar.scss"

import PhotoCameraFrontIcon from '@mui/icons-material/PhotoCameraFront';
import VideoFileOutlinedIcon from '@mui/icons-material/VideoFileOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import PostAddOutlinedIcon from '@mui/icons-material/PostAddOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import TextSnippetOutlinedIcon from '@mui/icons-material/TextSnippetOutlined';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import MailOutlineIcon from '@mui/icons-material/MailOutline';

import { Link } from "react-router-dom"

import { isLoggedIn } from "../../utils/helper/fetchBackend"

import {useEffect, useState} from "react"
import Axios from "axios"

function Sidebar() {

    const [logedin, setLogedin] = useState(localStorage.getItem('logedIn') === "true")

    useEffect(() => {
        isLoggedIn().then(res =>setLogedin(res))
    }, [])

    const logout = () => {
        Axios({
            method: "POST",
            withCredentials: true,
            url: process.env.REACT_APP_API_BASE+"/logout",
        }).then(()=>{localStorage.setItem("logedIn", false);window.location.reload(false)}) ;
        };

  if(logedin)
  {
    return (
        <div className='sidebar'>
            <div className="top">
                <Link to="/">
                    <img src={require('../../images/uhh-logo-web.gif')} alt="Dashboard"/>
                </Link>
            </div>
            <hr />
            <div className="center">
                <ul>
                    <p className="title">MAIN</p>
                    <Link to="/room" className="link">
                        <li>
                            <PhotoCameraFrontIcon className="icon" />
                            <span>Room</span>
                        </li>
                    </Link>
                    <p className="title">SURVEY</p>
                    <Link to="/survey" className="link">
                        <li>
                            <AssignmentOutlinedIcon className="icon" />
                            <span>List</span>
                        </li>
                    </Link>
                    <Link to="/survey/edit/create" className="link">
                        <li>
                            <PostAddOutlinedIcon className="icon" />
                            <span>Create new</span>
                        </li>
                    </Link>
                    <p className="title">RESULTS</p>
                    <Link to="/participants" className="link">
                        <li>
                            <PeopleOutlinedIcon className="icon" />
                            <span>Participants</span>
                        </li>
                    </Link>
                    <Link to="/recordings" className="link">
                        <li>
                            <VideoFileOutlinedIcon className="icon" />
                            <span>Recordings</span>
                        </li>
                    </Link>
                    <Link to="/survey/results" className="link">
                        <li>
                            <TextSnippetOutlinedIcon className="icon" />
                            <span>Survey Results</span>
                        </li>
                    </Link>
                    <p className="title">CALENDAR</p>
                    <Link to="/meetings" className="link">
                        <li>
                            <CalendarMonthOutlinedIcon className="icon" />
                            <span>Booked Meetings</span>
                        </li>
                    </Link>
                    
                    <p className="title">SETTINGS</p>
                    <Link to="/email" className="link">
                        <li>
                            <MailOutlineIcon className="icon" />
                            <span>Email Settings</span>
                        </li>
                    </Link>
                        
                    <Link to="/timesettings" className="link">
                        <li>
                            <AccessTimeOutlinedIcon className="icon" />
                            <span>Change Time Slots</span>
                        </li>
                    </Link>
                        <li onClick={() => logout()}>
                            <LogoutOutlinedIcon className="icon" />
                            <span>Logout</span>
                        </li>
                </ul>
            </div>
        </div>
    )
  }else{
    return (
        <div className='sidebar'>
            <div className="top">
                <Link to="/">
                    <img src={require('../../images/uhh-logo-web.gif')} alt="Dashboard"/>
                </Link>
            </div>
            <hr />
            <div className="center">
                <ul>
                    <p className="title">MAIN</p>
                    <Link className="link" to="/room">
                        <li>
                            <PhotoCameraFrontIcon className="icon" />
                            <span>Room</span>
                        </li>
                    </Link>
                    <Link className="link" to="/book">
                        <li>
                            <CalendarMonthOutlinedIcon className="icon" />
                            <span>Book Interview</span>
                        </li>
                    </Link>
                    <Link className="link" to="/about">
                        <li>
                            <PersonOutlineOutlinedIcon className="icon" />
                            <span>About you</span>
                        </li>
                    </Link>
                    <div className="bottom">
                        <p className="title">ADMIN</p>
                        <Link className="link" to="/login">
                            <li>
                                <LoginOutlinedIcon className="icon" />
                                <span>Admin Login</span>
                            </li>
                        </Link>
                    </div>
                </ul>
            </div>
        </div>
    )
  }
  

    
}

export default Sidebar