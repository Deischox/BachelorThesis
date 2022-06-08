import React, { createContext, useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import Peer from "peerjs";
import { Recorder } from "../helper/Recorder";
import { VideoStreamMerger } from "video-stream-merger";

const SocketContext = createContext();

function ContextProvider({ children }) {
  const [roomID, setRoomID] = useState(
    window.location.pathname.split("/").pop()
  );

  const [myID, setMyID] = useState();
  const [chat, setChat] = useState([]);
  const [currentCall, setCurrentCall] = useState(null);
  const [isRecording, setIsRecording] = useState(false);

  const peer = useRef();
  const socket = useRef();
  const video = useRef();
  const stream = useRef();
  const call = useRef();
  const recorder = useRef();

  const joinRoom = (username, myID) => {
    //setUsername(username);
    socket.current.emit("join-room", roomID, myID, username);
  };

  useEffect(() => {
    // returned function will be called on component unmount
    return () => {
      if (window.location.pathname !== "/room") {
        stopUsingUserCameraAndAudio();
      }
      if (roomID) {
        leaveRoom();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomID]);

  const leaveRoom = () => {
    if (currentCall) {
      currentCall.close();
      setCurrentCall(null);
      video.current.srcObject = stream.current;
    }
    if (socket.current !== undefined) {
      socket.current.emit("user-disconnected", roomID, "SILAS");
    }

    //otherVideo.current.srcObject = null;

    setRoomID("");
  };

  const connectToSocket = async () => {
    socket.current = io.connect(process.env.REACT_APP_WEBSITE, {
      path: process.env.REACT_APP_SOCKET_IO_BASE,
      rejectUnauthorized: false,
      transports: ["websocket"],
    });

    socket.current.on("connect_error", (e) => console.log("CONNECT_ERROR:", e));

    socket.current.on("receive-message", (msg, name, userID) => {
      setChat((oldmsg) => [
        ...oldmsg,
        { message: msg, name: name, from: userID },
      ]);
    });

    socket.current.on("user-connected", (userId, name) => {
      setChat((oldmsg) => [
        ...oldmsg,
        {
          message: `new user joined the room`,
          name: "[SERVER]",
          from: "SERVER",
        },
      ]);
      ConnectToNewUser(userId, stream.current);
    });

    socket.current.on("user-disconnect", (name) => {
      setChat((oldmsg) => [
        ...oldmsg,
        { message: `a user disconnected.`, name: "[SERVER]", from: "SERVER" },
      ]);
      setCurrentCall(null);
      if (recorder.current) {
        recorder.current.stopRecording();
      }
      video.current.srcObject = stream.current;
    });

    socket.current.on("start-recording", (name) => {
      setChat((oldmsg) => [
        ...oldmsg,
        {
          message: "You are now getting recorded",
          name: "[SERVER]",
          from: "SERVER",
        },
      ]);
    });

    socket.current.on("ask-recording", (ID) => {
      setChat((oldmsg) => [
        ...oldmsg,
        {
          message: "You are now getting recorded",
          name: "[SERVER]",
          from: "SERVER",
        },
      ]);

      recorder.current = new Recorder(stream.current, ID);
      recorder.current.Startrecording();
    });

    socket.current.on("stop-recording", () => {
      setChat((oldmsg) => [
        ...oldmsg,
        { message: "The recording stopped", name: "[SERVER]", from: "SERVER" },
      ]);
      stopRecording();
    });

    socket.current.on("stop-recording-host", (name) => {
      setChat((oldmsg) => [
        ...oldmsg,
        { message: "The recording stopped", name: "[SERVER]", from: "SERVER" },
      ]);
    });
  };

  const combineStreams = (otherStream) => {
    let videoElement = document.createElement("video");

    videoElement.muted = true;

    videoElement.srcObject = otherStream;

    videoElement.onloadedmetadata = () => {
      let dimensions = {
        width: videoElement.videoWidth,
        height: videoElement.videoHeight,
      };

      videoElement = null;

      var combined = new VideoStreamMerger({
        width: dimensions.width,
        height: dimensions.height,
      });

      combined.addStream(otherStream, {
        x: 0,
        y: 0,
        width: dimensions.width,
        height: dimensions.height,
        mute: false,
      });

      combined.addStream(stream.current, {
        x: 0,
        y: 0,
        width:
          (stream.current.getVideoTracks()[0].getSettings().width /
            dimensions.width) *
          dimensions.width *
          0.2,
        height:
          (stream.current.getVideoTracks()[0].getSettings().height /
            dimensions.height) *
          dimensions.height *
          0.2,
        mute: true,
      });

      combined.start();

      video.current.srcObject = combined.result;
    };
  };

  const getVideo = async () => {
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((mediaStream) => {
        video.current.srcObject = mediaStream;
        stream.current = mediaStream;

        /*peer.current = new Peer(undefined, {
          host: "localhost",
          port: 5001,
          path: "/",
        });*/
        peer.current = new Peer();

        peer.current.on("open", (id) => {
          console.log("connected to peer");
          setMyID(id);
          joinRoom("silas", id);
        });

        peer.current.on("error", (err) => {
          console.log("error ", err);
        });

        peer.current.on("call", (call) => {
          setCurrentCall(call);
          call.answer(mediaStream);
          call.on("stream", (stream) => {
            combineStreams(stream);
          });
        });
      });
  };

  const connectPeerJs = async () => {};

  const ConnectToNewUser = (userId, stream) => {
    var call = peer.current.call(userId, stream);
    setCurrentCall(call);
    call.on("stream", (stream) => {
      combineStreams(stream);
    });
  };

  const stopUsingUserCameraAndAudio = () => {
    if (stream.current !== undefined) {
      stream.current.getTracks().forEach((track) => {
        track.stop();
      });
      stream.current = null;
    }
  };

  const sendMessage = (msg, user) => {
    socket.current.emit("send-message", roomID, msg, user, myID);
  };

  const muteUser = (mute) => {
    stream.current.getAudioTracks()[0].enabled = mute;
  };

  const stopVideo = (stop) => {
    stream.current.getVideoTracks()[0].enabled = stop;
  };

  const recording = (record) => {
    if (isRecording) {
      stopRecording(record);
    } else {
      startRecording(record);
    }
  };

  const startRecording = (record) => {
    setChat((oldmsg) => [
      ...oldmsg,
      { message: "The recording started", name: "[SERVER]", from: "SERVER" },
    ]);
    if (record === "participant") {
      socket.current.emit("request-recording", roomID);
    } else {
      socket.current.emit("start-recording", roomID);
      recorder.current = new Recorder(video.current.srcObject, roomID);
      recorder.current.Startrecording();
    }
    setIsRecording(true);
  };

  const stopRecording = (record) => {
    setChat((oldmsg) => [
      ...oldmsg,
      { message: "The recording stopped", name: "[SERVER]", from: "SERVER" },
    ]);
    if (record === "participant") {
      socket.current.emit("stop-recording", roomID);
    } else {
      socket.current.emit("stop-recording-host", roomID);
      recorder.current.stopRecording();
    }

    setIsRecording(false);
  };

  return (
    <SocketContext.Provider
      value={{
        video,
        chat,
        myID,
        currentCall,
        connectPeerJs,
        connectToSocket,
        sendMessage,
        getVideo,
        muteUser,
        stopVideo,
        leaveRoom,
        recording,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export { ContextProvider, SocketContext };
