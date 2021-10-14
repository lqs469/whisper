import React, { useState, useCallback } from "react";
import { useHistory } from "react-router-dom";

export default function Home({ joinRoom }) {
    const history = useHistory();
    const [room, setRoom] = useState("123");
    const [name, setName] = useState("user_" + Math.round(Math.random() * 100000).toString(16));

    const handleJoin = useCallback(() => {
        joinRoom(name, room, (roomId) => {
            history.push("/room/" + roomId);
        });
    }, [room, name, joinRoom, history]);

    return (
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