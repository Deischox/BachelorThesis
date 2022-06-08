import "./room.scss"

import Roomselect from "../../components/roomselect/Roomselect"

import {ContextProvider} from "../../utils/context/SocketContext"


function Room() {

   return (<ContextProvider><Roomselect /></ContextProvider>)

}


export default Room