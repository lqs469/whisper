import React, { useState, useCallback, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import List from "./List";
import RoomClient from "./roomClient";

export default function Home({ joinRoom }) {
    let location = useLocation();
    const history = useHistory();
    const [room, setRoom] = useState("123");
    const [name, setName] = useState("user_" + Math.round(Math.random() * 100000).toString(16));
    const [joined, setJoined] = useState(false);
    const [joining, setJoining] = useState(false);
    const [showList, setShowList] = useState(false);

    const handleJoin = useCallback((sName, sRoom) => {
        setJoining(true);
        if (!joining && !joined) {
            joinRoom(sName || name, sRoom || room, (roomId) => {
                setJoined(true);
                setJoining(false);
                history.push("/room/" + roomId);
            });
        }
    }, [joining, joined, room, name, joinRoom, history]);

    useEffect(() => {
        if (location.pathname.includes("room")) {
            setJoining(true);
            if (!joining && !joined) {
                joinRoom(name, room, () => {
                    setJoined(true);
                    setJoining(false);
                    // addListeners()
                });
            }
        } else {
            setShowList(true);
        }

        return () => {
            setJoined(false);
            setJoining(false);
        }
    }, [joinRoom, joined, joining, location.pathname, name, room]);

    // const addListeners = useCallback(() => {
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
    // }, []);

    if (joined) {
        return null;
    }

    return joining ? "Joining..." : (
        <div>
            <div id="login">
                <h2>New Room</h2>
                <div>
                    <i> Room: </i>
                    <input id="roomidInput" value={room} type="text" onChange={e => setRoom(e.target.value)} />
                </div>
                {/* <button id="createRoom" onclick="createRoom(roomid.value)" label="createRoom">Create Room</button> */}
                <div>
                    <i> Name: </i>
                    <input id="nameInput" value={name} type="text" onChange={e => setName(e.target.value)} />
                </div>
                <button id="joinButton" onClick={() => handleJoin()}>Join</button>
            </div>

            <br />
            {showList && <List name={name} handleJoin={handleJoin} />}
        </div>
    );
}