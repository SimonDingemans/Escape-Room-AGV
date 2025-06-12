import {Draggable} from "../Draggable.jsx";
import React from "react";
import {useWsStore} from "../../../../ws.js";

export const Sidebar = () => {
    const messages = useWsStore(state => state.getMessages('chat'));

    return <aside>
        <Draggable id="VIDEO">Video</Draggable>
        <div style={{marginTop: '1rem', width: '15rem', maxWidth: '20rem', overflow: "scroll"}}>
            <h2>Messages</h2>
            {messages ? messages.map((message, index) => <p key={index}>{message}</p>) : null}
        </div>
    </aside>
}