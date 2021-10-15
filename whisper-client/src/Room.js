import React, { useState, useCallback } from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useRouteMatch,
    useParams
} from "react-router-dom";
import * as RoomClient from "./roomClient";

export default function Room({ audioSelector, videoSelector }) {
    const match = useRouteMatch();
    const { rc } = window;

    return (
        <div>
            <h2>Room</h2>
            {/* <ul>
          <li>
            <Link to={`${match.url}/components`}>Components</Link>
          </li>
          <li>
            <Link to={`${match.url}/props-v-state`}>
              Props v. State
            </Link>
          </li>
        </ul> */}

            {/* The Topics page has its own <Switch> with more routes
            that build on the /topics URL path. You can think of the
            2nd <Route> here as an "index" page for all topics, or
            the page that is shown when no topic is selected */}
            <Switch>
                <Route path={`${match.path}/:roomId`}>
                    <Topic />
                </Route>
            </Switch>
            <div>
                <div id="control">
                    <br />
                    <button id="exitButton" onClick={() => rc.exit()}>
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

function Topic() {
    let { roomId } = useParams();
    return <h3>Room ID: {roomId}</h3>;
}
