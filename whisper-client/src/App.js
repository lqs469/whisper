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

window.rc = null;

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

export default function App() {
  const [connected, setConnected] = useState(false);
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

    if (window.rc && window.rc.isOpen()) {
      console.log('Already connected to a room')
    } else {
      initEnumerateDevices()

      window.rc = new RoomClient(mediasoupClient, window.socket, roomId, name, () => cb(roomId));
    }
  });

  useEffect(() => {
    setConnected(true);
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
        <br />

        {
          connected && <div>
            <Route path="/">
              <Home joinRoom={joinRoom} />
            </Route>
            <Route path="/room">
              <Room videoSelector={videoSelector} audioSelector={audioSelector} />
            </Route>
            <Route path="/about">
              <About />
            </Route>
          </div>
        }
      </div>
    </Router>
  );
}

function About() {
  return <h2>About</h2>;
}