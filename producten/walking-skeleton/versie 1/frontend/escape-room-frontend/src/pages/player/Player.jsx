import './Player.css'
// import {setServerMessage} from "../../wsUtils.js";
import { useState, useEffect } from 'react';
import {useWsStore} from "../../ws.js";
import {Timer} from "./Timer.jsx";

export const Player = () => {
    const messages = useWsStore(state => state.getMessages('timer')) ?? [];
    const connect = useWsStore(state => state.connect);
    const disconnect = useWsStore(state => state.disconnect);
    const sendMessage = useWsStore(state => state.sendMessage);

    useEffect(() => {
        const connectToServer = async () => {
            disconnect()
            connect('OPERATOR');
        };

        // noinspection JSIgnoredPromiseFromCall
        connectToServer();
    }, []);

    return (
        <>
            <Timer />
            <div id="messages">
                <b>Messages</b>
                {messages.map((message, index) => <p key={index}>{JSON.stringify(message)}</p>)}
            </div>
            <br/>
            <form onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.target)
                sendMessage(formData.get('text'))
            }}>
                <input type="text" name='text' id="text" placeholder="Type a message..."/>
                <button type={"submit"}>Send</button>
            </form>
        </>
    )

}

