import React, { useCallback, useEffect, useState, useRef } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams
} from "react-router-dom";
import * as mediasoupClient from "mediasoup-client";
import { io } from "socket.io-client";

import Home from "./Home";
import Room from "./Room";
import RoomClient from "./roomClient";

const socket = io("https://127.0.0.1:3016");
let rc = null

export default function App() {
  const [audioOptions, setAudioOptions] = useState([]);
  const [videoOptions, setVideoOptions] = useState([]);
  const audioSelector = useRef(null);
  const videoSelector = useRef(null);

  const joinRoom = useCallback((name, roomId, cb) => {
    let isEnumerateDevices = false

    function initEnumerateDevices() {
      // Many browsers, without the consent of getUserMedia, cannot enumerate the devices.
      if (isEnumerateDevices) return

      const constraints = {
        audio: true,
        video: true
      }

      navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
          enumerateDevices()
          stream.getTracks().forEach(function (track) {
            track.stop()
          })
        })
        .catch((err) => {
          console.error('Access denied for audio/video: ', err)
        })
    }

    function enumerateDevices() {
      // Load mediaDevice options
      navigator.mediaDevices.enumerateDevices().then((devices) =>
        devices.forEach((device) => {
          if ('audioinput' === device.kind) {
            setAudioOptions([...audioOptions, {
              value: device.deviceId,
              text: device.label
            }])
          } else if ('videoinput' === device.kind) {
            setVideoOptions([...videoOptions, {
              value: device.deviceId,
              text: device.label
            }])
          }

          isEnumerateDevices = true
        })
      )
    }

    function addListeners() {
      rc.on(RoomClient.EVENTS.startScreen, () => {
        // hide(startScreenButton)
        // reveal(stopScreenButton)
      })

      rc.on(RoomClient.EVENTS.stopScreen, () => {
        // hide(stopScreenButton)
        // reveal(startScreenButton)
      })

      rc.on(RoomClient.EVENTS.stopAudio, () => {
        // hide(stopAudioButton)
        // reveal(startAudioButton)
      })
      rc.on(RoomClient.EVENTS.startAudio, () => {
        // hide(startAudioButton)
        // reveal(stopAudioButton)
      })

      rc.on(RoomClient.EVENTS.startVideo, () => {
        // hide(startVideoButton)
        // reveal(stopVideoButton)
      })
      rc.on(RoomClient.EVENTS.stopVideo, () => {
        // hide(stopVideoButton)
        // reveal(startVideoButton)
      })
      rc.on(RoomClient.EVENTS.exitRoom, () => {
        // hide(control)
        // hide(devicesList)
        // hide(videoMedia)
        // hide(copyButton)
        // hide(devicesButton)
        // reveal(login)
      })
    }

    if (rc && rc.isOpen()) {
      console.log('Already connected to a room')
    } else {
      initEnumerateDevices()

      rc = new RoomClient(mediasoupClient, socket, roomId, name, () => cb(roomId))

      addListeners()
    }
  }, []);

  useEffect(() => {
    socket.request = function request(type, data = {}) {
      return new Promise((resolve, reject) => {
        socket.emit(type, data, (data) => {
          if (data.error) {
            reject(data.error)
          } else {
            resolve(data)
          }
        })
      })
    }

    // function roomOpen() {
    //   alert("room open");
    //   login.className = 'hidden'
    //   reveal(startAudioButton)
    //   hide(stopAudioButton)
    //   reveal(startVideoButton)
    //   hide(stopVideoButton)
    //   reveal(startScreenButton)
    //   hide(stopScreenButton)
    //   reveal(exitButton)
    //   reveal(copyButton)
    //   reveal(devicesButton)
    //   control.className = ''
    //   reveal(videoMedia)
    // }
  }, []);

  return (
    <Router>
      <div>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/room">Room</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
        </ul>

        <div id="devicesList">
          Audio:
          <select ref={audioSelector} style={{ width: "auto" }}>
            {
              audioOptions.map(item => <option key={item.value} value={item.value}>{item.text}</option>)
            }
          </select>
          <br />
          Video:
          <select ref={videoSelector} style={{ width: "auto" }}>
            {
              videoOptions.map(item => <option key={item.value} value={item.value}>{item.text}</option>)
            }
          </select>
        </div>

        <Switch>
          <Route exact path="/">
            <Home joinRoom={joinRoom} />
          </Route>
          <Route path="/room">
            <Room rc={rc} videoSelector={videoSelector.current} audioSelector={audioSelector.current} />
          </Route>
          <Route path="/about">
            <About />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

function About() {
  return <h2>About</h2>;
}