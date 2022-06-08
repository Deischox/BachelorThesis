import {useEffect, useState, createContext} from 'react'
import {getUser} from "../helper/fetchBackend"

import Needlogin from "../../components/needlogin/Needlogin"
import Loading from "../../components/loading/Loading"

const context = createContext(null);

function UserProvider({children}) {
  
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUser().then((res) => {setUser(res); setLoading(false)})
  }, [])

  if(loading)
  {
    return <Loading/>
  }

  if(user === undefined)
  {
    return <Needlogin/>
  }else
  {
    return (
      <context.Provider value={user}>
          {children}
      </context.Provider>
  );
  }

  

  
}

UserProvider.context = context;

export default UserProvider;