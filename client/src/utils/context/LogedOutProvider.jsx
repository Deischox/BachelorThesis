import {useEffect, useState, createContext} from 'react'
import {getUser} from "../helper/fetchBackend"

import Needlogin from "../../components/needlogin/Needlogin"
import Loading from "../../components/loading/Loading"

const context = createContext(null);

function LogedOutProvider({children}) {
  
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUser().then((res) => {setUser(res); setLoading(false)})
  }, [])

  if(loading)
  {
    return <Loading/>
  }

  if(user !== undefined)
  {
    window.location.href = "/"
  }else
  {
    return (
      <context.Provider value={user}>
          {children}
      </context.Provider>
  );
  }

  

  
}

LogedOutProvider.context = context;

export default LogedOutProvider;