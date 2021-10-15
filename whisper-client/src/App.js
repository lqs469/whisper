import React, { useCallback, useEffect, useState, useRef } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from "react-router-dom";
import { io } from "socket.io-client";

import Home from "./Home";
import Room from "./Room";

window.socket = io("https://whisper.lqs469.com");
window.socket.request = function request(type, data = {}) {
  return new Promise((resolve, reject) => {
    window.socket.emit(type, data, (data) => {
      if (data.error) {
        reject(data.error)
      } else {
        resolve(data)
      }
    })
  })
}


const constraints = {
  audio: true,
  video: true
}

export default function App() {
  const [name, setName] = useState("user_" + Math.round(Math.random() * 100000).toString(16))
  const [connected, setConnected] = useState(false);
  const [audioOptions, setAudioOptions] = useState([]);
  const [videoOptions, setVideoOptions] = useState([]);
  const audioSelector = useRef(null);
  const videoSelector = useRef(null);

  useEffect(() => {
    const audioOptions = []
    const videoOptions = []

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        // Load mediaDevice options
        navigator.mediaDevices.enumerateDevices().then(devices => {
          devices.forEach((device) => {
            if ('audioinput' === device.kind) {
              audioOptions.push({
                value: device.deviceId,
                text: device.label
              })
            } else if ('videoinput' === device.kind) {
              videoOptions.push({
                value: device.deviceId,
                text: device.label
              })
            }
          })

          setAudioOptions(audioOptions)
          setVideoOptions(videoOptions)

          setConnected(true);
        })

        stream.getTracks().forEach((track) => {
          track.stop()
        })
      })
      .catch((err) => {
        console.error('Access denied for audio/video: ', err)
        setConnected(true);
      })
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
            {audioOptions.map(item => <option key={item.value} value={item.value}>{item.text}</option>)}
          </select>
          <br />
          Video:
          <select ref={videoSelector} style={{ width: "auto" }}>
            {videoOptions.map(item => <option key={item.value} value={item.value}>{item.text}</option>)}
          </select>
        </div>
        <br />

        <div>
          <i> Name: </i>
          <input id="nameInput" value={name} type="text" readOnly />
        </div>

        {
          connected && <Switch>
            <Route exact path="/">
              <Home name={name} />
            </Route>
            <Route path="/room/:roomId">
              <Room name={name} videoSelector={videoSelector} audioSelector={audioSelector} />
            </Route>
            <Route path="/about">
              <About />
            </Route>
          </Switch>
        }
      </div>
    </Router>
  );
}

function About() {
  return <h2>About</h2>;
}