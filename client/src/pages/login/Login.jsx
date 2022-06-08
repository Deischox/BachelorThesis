import "./login.scss"

import Sidebar from "../../components/sidebar/Sidebar"

import Axios from "axios"
import { useState,useEffect  } from 'react'

function Login() {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState('')
  const [error, setError] = useState('')

  const login = () => {
    Axios({
      method: "POST",
      data: {
        username: username,
        password: password,
      },
      withCredentials: true,
      url: process.env.REACT_APP_API_BASE+"/login",
    }).then( async( res)  => {
      if(res.data === "Successfully Authenticated")
      {
        await getUser(); 
        localStorage.setItem("logedIn", true)
        window.location.reload(false)
      }else{
        setError("Wrong Username or Password")
      }
  
  })
  }

  const getUser = () => {
    Axios({
      method: "GET",
      withCredentials: true,
      url: process.env.REACT_APP_API_BASE+"/user",
    })
    .then((res) => setUser(res.data.username));
  };

  const logout = () => {
    Axios({
      method: "POST",
      withCredentials: true,
      url: process.env.REACT_APP_API_BASE+"/logout",
    }).then(setUser('')).then(()=>window.location.reload(false)) ;
  };

  useEffect(() => {
    getUser()
  }, [])

  return (
    <div className="login">
        <Sidebar/>
        <div className="loginContainer">
            <div className="loginWidget">
              
                <ErrorMessage error={error}/>
                <span className="title">Admin Login</span>
                <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} className="formInput"/>
                <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} className="formInput" />
                <button className="loginButton" onClick={() => login()}>Login</button>
            </div>
        </div>
    </div>
  )
}

const ErrorMessage = ({error}) => {
  if(error) return <span className="error">{error}</span>
  return 
}

export default Login