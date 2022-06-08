import "./creation.scss"

import Sidebar from "../../../components/sidebar/Sidebar"
import Loading from "../../../components/loading/Loading"

import { Button } from "@mui/material"
import TextField from '@mui/material/TextField';


import Axios from "axios"
import { useState,useEffect  } from 'react'

function Creation() {

  const [loading, setLoading] = useState(true)
  const [password, setPassword] = useState('')
  const [adminExists, setAdminExists] = useState('')
  const [error, setError] = useState()
  const [success, setSuccess] = useState()

  const createAccount = () => {
    Axios({
      method: "POST",
      data: {
        password: password,
      },
      url: process.env.REACT_APP_API_BASE+"/setup",
    }).then( async( res)  => {
        if(res.data === "New Admin User created."){
            setAdminExists(true)
            setSuccess('New Admin User created')
        }else{
            setError(error)
        }
        
  })
  }


  const checkAdmin = () => {
    Axios({
      method: "GET",
      url: process.env.REACT_APP_API_BASE+"/adminAccount",
    }).then((r) => {
        if(r.data){
            setError('An admin account already exists!')
            setAdminExists(r.data); 
        }
        
        setLoading(false)});
  };

  useEffect(() => {
    checkAdmin()
  }, [])

  if(loading)
  {
      return <Loading/>
  }

  return (
    <div className="creation">
        <Sidebar/>
        <div className="creationContainer">
            <InputFields exists={adminExists} setPassword={setPassword} password={password} createAccount={createAccount} error={error} success={success}/>
        </div>
    </div>
  )
}

const InputFields = ({exists, setPassword, createAccount, error, success, password}) => {
    if(!exists) {
      return (
        <div className="creationWidget">
            <span className="title">Create Admin Account</span>
            <TextField
                id="outlined-required"
                className="inputField"
                label="Username"
                defaultValue="Admin"
                disabled
            />
            <TextField
                id="outlined-required"
                className="inputField"
                required
                label="Password"
                defaultValue=""
                onChange={(e) => setPassword(e.target.value)}
            />
            <Button className="loginButton" variant="outlined"  disabled={password.length < 1} onClick={() => createAccount()}>Create Account</Button>
        </div>
      )
  }else{
      return (
        <div className="creationWidget">
            {error ? <div className="error">{error}</div> : ""}
            {success ? <div className="success">{success}</div> : "" }
            <span className="title">Create Admin Account</span>
            <TextField
                id="outlined-required"
                className="inputField"
                label="Username"
                defaultValue="Admin"
                disabled
            />
            <TextField
                id="outlined-required"
                className="inputField"
                required
                label="Password"
                defaultValue=""
                disabled
            />
            <Button className="loginButton" variant="outlined"  disabled={true} onClick={() => createAccount()}>Create Account</Button>
        </div>
      )
  }
}

export default Creation