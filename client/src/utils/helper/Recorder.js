import { DatabaseHelper } from "./Databasehelper";
import Axios from "axios";
/**
 * Records a room an send the data to the backend
 */
class Recorder {
  /**
   * @param {Stream} stream The stream that should get recorded.
   * @param {String} name The name for the saved recording.
   */
  constructor(stream, name) {
    this.stream = stream;
    this.user = name;
    this.recording = false;
    this.options = { mimeType: "video/webm;codecs=h264,vp9,opus" };
    this.recorder = new MediaRecorder(this.stream);
    this.name = name;
    this.DatabaseHelper = new DatabaseHelper();
  }

  checkIfNameIsFree = async () => {
    Axios({
      method: "GET",
      withCredentials: true,
      url: process.env.REACT_APP_API_BASE + "/video/" + this.name,
    }).then((res) => {
      if (res.data === true) {
        this.name += "_" + Date.now().toString();
      }
      this.DatabaseHelper.newVideoEntry({
        title: this.name,
        path: "/videos/" + this.name,
        userID: this.user,
      });
    });
  };

  /**
   * Starts the recording of the room
   */
  Startrecording = async () => {
    // should actually check to see if the given mimeType is supported on the browser here.
    this.checkIfNameIsFree();

    this.recorder.ondataavailable = this.postBlob;
    this.recorder.start(3000);
    this.recording = true;
  };

  /**
   * Stops the recording
   */
  stopRecording = () => {
    this.recorder.stop();
    this.recording = false;
  };

  /**
   * If Data is available, call the function that sends data to the server
   * @param  {Blob} event The available event with the data
   */
  postBlob = (event) => {
    if (event.data && event.data.size > 0) {
      this.sendBlobAsBase64(event.data);
    }
  };

  /**
   * Read blob data and convert it to base64 encoded Data
   * @param  {Blob} blob The available blob with the video data
   */
  sendBlobAsBase64 = (blob) => {
    const reader = new FileReader();

    reader.addEventListener("load", () => {
      const dataUrl = reader.result;
      let base64EncodedData;

      if (dataUrl.split(",")[1].length < 200) {
        base64EncodedData = dataUrl.split(",")[2];
      } else {
        base64EncodedData = dataUrl.split(",")[1];
      }

      this.sendDataToBackend(base64EncodedData);
    });

    reader.readAsDataURL(blob);
  };

  /**
   * Sends the blob to the server as Base 64
   * @param  {Blob} base64EncodedData The available blob as base64 encoded Data
   */
  sendDataToBackend = (base64EncodedData) => {
    Axios({
      method: "POST",
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
      data: { data: base64EncodedData, filename: this.name },
      url: process.env.REACT_APP_API_BASE + "/recordVideo",
    });
  };
}

export { Recorder };
