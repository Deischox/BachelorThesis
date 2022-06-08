import "./loading.scss"


import Sidebar from "../../components/sidebar/Sidebar"

import { TailSpin } from "react-loader-spinner"

function Loading() {
    return (
    <div className="loading">
        <Sidebar/>
        <div className="loadingContainer">
            <TailSpin color="#e2001a" height={250} width={250} />
        </div>
    </div>
)
}

export default Loading