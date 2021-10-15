import React, { useState, useCallback, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";

export default function Home({ joinRoom }) {
    let location = useLocation();
    const history = useHistory();
    const [room, setRoom] = useState("123");
    const [name, setName] = useState("user_" + Math.round(Math.random() * 100000).toString(16));
    const [joined, setJoined] = useState(false);
    const [joining, setJoining] = useState(false);

    const handleJoin = useCallback(() => {
        setJoining(true);
        if (!joining && !joined) {
            joinRoom(name, room, (roomId) => {
                history.push("/room/" + roomId);
                setJoined(true);
                setJoining(false);
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
                });
            }
        }
    }, [joinRoom, joined, joining, location.pathname, name, room]);

    if (joined) {
        return null;
    }

    return joining ? "Joining..." : (
        <div>
            <div id="login">
                <div>
                    <i> Room: </i>
                    <input id="roomidInput" value={room} type="text" onChange={e => setRoom(e.target.value)} />
                </div>
                {/* <button id="createRoom" onclick="createRoom(roomid.value)" label="createRoom">Create Room</button> */}
                <div>
                    <i> Name: </i>
                    <input id="nameInput" value={name} type="text" onChange={e => setName(e.target.value)} />
                </div>
                <button id="joinButton" onClick={handleJoin}>Join</button>
            </div>
        </div>
    );
}