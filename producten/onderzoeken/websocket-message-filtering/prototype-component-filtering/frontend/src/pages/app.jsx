import {Chat} from "../components/chat.jsx";

import './app.css'
import {useEffect} from "react";
import {useWsStore} from "../ws.js";

export const App = () => {
    const connect = useWsStore(state => state.connect);
    const disconnect = useWsStore(state => state.disconnect);

    useEffect(() => {
        const connectToServer = async () => {
            disconnect()
            connect('OPERATOR');
        };

        // noinspection JSIgnoredPromiseFromCall
        connectToServer();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <main className="app">
        <Chat id={'left'}/>
        <Chat id={'right'}/>
        <Chat id={'noId'}/>
    </main>
}