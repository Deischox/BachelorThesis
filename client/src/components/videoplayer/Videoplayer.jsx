import "./videoplayer.scss"

function Videoplayer({videoref, call}) {
  return (
    <div className="videoplayer">
        <video className="video" muted={call === null} playsInline ref={videoref} autoPlay></video>
    </div>
  )
}

export default Videoplayer