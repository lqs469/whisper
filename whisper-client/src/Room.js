import React, { useState, useCallback, useEffect } from "react";
import {
  useHistory,
  useRouteMatch,
  useParams
} from "react-router-dom";
import * as mediasoupClient from "mediasoup-client";
import RoomClient from "./roomClient";

export default function Room({ name, audioSelector, videoSelector }) {
  let { roomId } = useParams()
  const history = useHistory()
  const [rc, setRc] = useState(null)

  const joinRoom = useCallback((roomId, cb) => {
    if (rc && rc.isOpen()) {
      console.log('Already connected to a room')
      return rc
    }

    console.log("RoomClient")
    const newRc = new RoomClient(mediasoupClient, window.socket, roomId, name, () => cb && cb(roomId));
    setRc(newRc)
    return newRc
  }, [name, rc, setRc, mediasoupClient, window.socket]);

  useEffect(() => {
    let rc = null;

    if (roomId) {
      rc = joinRoom(roomId)
    }

    return () => {
      rc.exit()
    }
  }, [])

  return (
    <div>
      <h3>Room ID: {roomId}</h3>
      <div>
        <div id="control">
          <br />
          <button id="exitButton" onClick={() => history.push("/")}>
            Exit
          </button>
          <button id="copyButton" onClick={() => rc.copyURL()}>
            copy URL
          </button>
          <button id="devicesButton" onClick={() => rc.showDevices()}>
            Devices
          </button>
          <button
            id="startAudioButton"
            onClick={() => rc.produce(RoomClient.mediaType.audio, audioSelector.current.value)}
          >
            Open audio
          </button>
          <button id="stopAudioButton" onClick={() => rc.closeProducer(RoomClient.mediaType.audio)}>
            Close audio
          </button>
          <button
            id="startVideoButton"
            onClick={() => rc.produce(RoomClient.mediaType.video, videoSelector.current.value)}
          >
            Open video
          </button>
          <button id="stopVideoButton" onClick={() => rc.closeProducer(RoomClient.mediaType.video)}>
            Close video
          </button>
          <button id="startScreenButton" onClick={() => rc.produce(RoomClient.mediaType.screen)}>
            Open screen
          </button>
          <button id="stopScreenButton" onClick={() => rc.closeProducer(RoomClient.mediaType.screen)}>
            Close screen
          </button>
        </div>
      </div>
    </div>
  );
}