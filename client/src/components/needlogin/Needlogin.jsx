import "./needlogin.scss"

import Sidebar from "../../components/sidebar/Sidebar"
import { Link } from "react-router-dom"

function Needlogin() {
  return (
    <div className="needLogin">
        <Sidebar/>
        <div className="needLoginContainer">
            <div className="message">
            You need to <Link to="/login">login</Link> to access this page!
            </div>
        </div>
    </div>
  )
}

export default Needlogin