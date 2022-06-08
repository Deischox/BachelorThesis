import "./popup.scss"

function Popup({show, title, message, acceptFunction, changePopupState, acceptTitle, denyTitle}) {
    if(!show){
        return 
    }
  return (
    <div className="popup">
        <div className="popupContainer">
            <div className="top">
                <div className="title">
                    {title}
                </div>
            </div>
            <div className="middle">
                <div className="consent">
                    {message}
                </div>
            </div>
            <div className="bottom">
                <button className="acceptButton" onClick={() => {acceptFunction();changePopupState(false)}}>{acceptTitle}</button>
                <button className="denyButton" onClick={() => changePopupState(false)}>{denyTitle}</button>
            </div>
        </div>
    </div>
  )
}

export default Popup