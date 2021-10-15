import React, { useState, useCallback, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import List from "./List";
import RoomClient from "./roomClient";

// const addListeners = () => {
//     window.rc.on(RoomClient.EVENTS.startScreen, () => {
//         // hide(startScreenButton)
//         // reveal(stopScreenButton)
//     })

//     window.rc.on(RoomClient.EVENTS.stopScreen, () => {
//         // hide(stopScreenButton)
//         // reveal(startScreenButton)
//     })

//     window.rc.on(RoomClient.EVENTS.stopAudio, () => {
//         // hide(stopAudioButton)
//         // reveal(startAudioButton)
//     })
//     window.rc.on(RoomClient.EVENTS.startAudio, () => {
//         // hide(startAudioButton)
//         // reveal(stopAudioButton)
//     })

//     window.rc.on(RoomClient.EVENTS.startVideo, () => {
//         // hide(startVideoButton)
//         // reveal(stopVideoButton)
//     })
//     window.rc.on(RoomClient.EVENTS.stopVideo, () => {
//         // hide(stopVideoButton)
//         // reveal(startVideoButton)
//     })
//     window.rc.on(RoomClient.EVENTS.exitRoom, () => {
//         // hide(control)
//         // hide(devicesList)
//         // hide(videoMedia)
//         // hide(copyButton)
//         // hide(devicesButton)
//         // reveal(login)
//         history.push("/");
//     })
// };

export default function Home({ joinRoom }) {
  const history = useHistory();
  const [room, setRoom] = useState("123");

  const handleJoin = useCallback((sRoom) => {
    history.push("/room/" + sRoom)
    // joinRoom(sRoom, roomId => history.push("/room/" + roomId))
  }, [joinRoom])

  const handleCreate = useCallback(() => {
    history.push("/room/" + room)
    // joinRoom(room, roomId => history.push("/room/" + roomId))
  }, [room, joinRoom])

  return (
    <div>
      <div id="createRoom">
        <h3>Create a Room</h3>
        <div>
          <i> Room: </i>
          <input id="roomidInput" value={room} type="text" onChange={e => setRoom(e.target.value)} />
          <button id="joinButton" onClick={handleCreate}>Create</button>
        </div>
      </div>

      <br />
      <List handleJoin={handleJoin} />
    </div>
  )
}