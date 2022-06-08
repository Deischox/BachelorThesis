import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Survey from "./pages/survey/Survey";
import Participants from "./pages/participants/Participants";
import Recordings from "./pages/recordings/Recordings";
import Timesettings from "./pages/timesettings/Timesettings";
import Meetings from "./pages/meetings/Meetings";
import Room from "./pages/room/Room";
import Surveyresults from "./pages/survey/surveyresults/Surveyresults";
import Videocall from "./pages/videocall/Videocall";
import Createsurvey from "./pages/survey/createsurvey/Createsurvey";
import Takesurvey from "./pages/survey/takesurvey/Takesurvey";
import Booking from "./pages/booking/Booking";
import Introduction from "./pages/introduction/Introduction";
import Statistics from "./pages/survey/statistics/Statistics";
import GuestSurvey from "./pages/guestSurvey/GuestSurvey";
import EmailSettings from "./pages/emailSettings/EmailSettings";

import UserProvider from "./utils/context/UserProvider";
import LogedOutProvider from "./utils/context/LogedOutProvider";

import { ContextProvider } from "./utils/context/SocketContext";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Creation from "./pages/login/creation/Creation";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route index element={<Home />} />
            <Route
              path="login"
              element={
                <LogedOutProvider>
                  <Login />
                </LogedOutProvider>
              }
            />
            <Route
              path="setup"
              element={
                <LogedOutProvider>
                  <Creation />
                </LogedOutProvider>
              }
            />
            <Route path="users">
              <Route
                index
                element={
                  <UserProvider>
                    <Home />
                  </UserProvider>
                }
              />
              <Route
                path=":userId"
                element={
                  <UserProvider>
                    <Home />
                  </UserProvider>
                }
              />
            </Route>
            <Route path="survey">
              <Route
                index
                element={
                  <UserProvider>
                    <Survey />
                  </UserProvider>
                }
              />
              <Route
                path="results"
                element={
                  <UserProvider>
                    <Surveyresults />
                  </UserProvider>
                }
              />
              <Route
                path="edit/:surveyID"
                element={
                  <UserProvider>
                    <Createsurvey />
                  </UserProvider>
                }
              />
              <Route
                path="statistics/:surveyID"
                element={
                  <UserProvider>
                    <Statistics />
                  </UserProvider>
                }
              />
              <Route path=":surveyID" element={<Takesurvey />} />
            </Route>
            <Route
              path="participants"
              element={
                <UserProvider>
                  <Participants />
                </UserProvider>
              }
            />
            <Route
              path="recordings"
              element={
                <UserProvider>
                  <Recordings />
                </UserProvider>
              }
            />
            <Route
              path="timesettings"
              element={
                <UserProvider>
                  <Timesettings />
                </UserProvider>
              }
            />
            <Route
              path="meetings"
              element={
                <UserProvider>
                  <Meetings />
                </UserProvider>
              }
            />
            <Route
              path="email"
              element={
                <UserProvider>
                  <EmailSettings />
                </UserProvider>
              }
            />
            <Route path="book" element={<Booking />} />
            <Route path="about" element={<Introduction />} />
            <Route path="surveys" element={<GuestSurvey />} />
            <Route path="room">
              <Route index element={<Room />} />
              <Route
                path=":roomID"
                element={
                  <ContextProvider>
                    <Videocall />
                  </ContextProvider>
                }
              />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
