import "./home.scss"

import Sidebar from "../../components/sidebar/Sidebar"
import HomeIcon from '@mui/icons-material/Home';

import { Survey, StylesManager, Model } from "survey-react";
import { useState, useEffect } from "react";

import { isLoggedIn } from "../../utils/helper/fetchBackend";
import Loading from "../../components/loading/Loading";

function Home() {

  const [homePage, setHomePage] = useState()
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    isLoggedIn().then((r) => {
      if(r)
      {
        setHomePage(<AdminHomePage/>)
      }else{
        setHomePage(<UserHomePage/>)
      }
      setLoading(false)
    }
    )
  }, [])

  if(loading)
  {
    return <Loading/>
  }else{
    return homePage
  }
  
}

export default Home


function AdminHomePage() {
  return (
    <div className="home">
        <Sidebar/>
        <div className="homeContainer">
          <div className="top">
            <h1 className="title">
              ADMIN WELCOME
            </h1>
            <div className="text">
              Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
            </div>
          </div>
          <div className="center">
            <div className="textContainer">
              <div className="top">
                <div className="title">
                  Title 1
                </div>
              </div>
              <div className="center">
                <div className="text">
                  Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
                </div>
                <img src="https://doodle-hund.de/images/Cavapoo/F1_Red_Toy_Cavoodle_Puppy.jpg" alt="Girl in a jacket"/>
              </div>
            </div>
            <div className="textContainer">
              <div className="top">
                <div className="title">
                  Title 1
                </div>
              </div>
              <div className="center">
                <div className="text">
                  Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
                </div>
                <img src="https://doodle-hund.de/images/Cavapoo/F1_Red_Toy_Cavoodle_Puppy.jpg" alt="Girl in a jacket"/>
              </div>
            </div>
          </div>

        </div>
    </div>
  )
}

function UserHomePage() {
  return (
    <div className="home">
        <Sidebar/>
        <div className="homeContainer">
          <div className="top">
            <h1 className="title">
              USER WELCOME
            </h1>
            <div className="text">
              Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
            </div>
          </div>
          <div className="center">
            <div className="textContainer">
              <div className="top">
                <div className="title">
                  Title 1
                </div>
              </div>
              <div className="center">
                <div className="text">
                  Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
                </div>
                <img src="https://doodle-hund.de/images/Cavapoo/F1_Red_Toy_Cavoodle_Puppy.jpg" alt="Girl in a jacket"/>
              </div>
            </div>
            <div className="textContainer">
              <div className="top">
                <div className="title">
                  Title 1
                </div>
              </div>
              <div className="center">
                <div className="text">
                  Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
                </div>
                <img src="https://doodle-hund.de/images/Cavapoo/F1_Red_Toy_Cavoodle_Puppy.jpg" alt="Girl in a jacket"/>
              </div>
            </div>
          </div>

        </div>
    </div>
  )
}