import {useWsStore} from "../stores/wsStore.js";

export const ConnectionState = () => {
    const isConnected = useWsStore(state => state.isConnected);
    const tdOnline = useWsStore(state => state.tdOnline);

    return <ul style={{listStyle: 'none', padding: 0, margin: 0}}>
        <li>Connected: {isConnected.toString()}</li>
        <li>TouchDesigner connected: {tdOnline.toString()}</li>
    </ul>
}