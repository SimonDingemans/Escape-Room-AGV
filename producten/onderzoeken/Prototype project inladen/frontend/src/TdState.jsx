import {useEffect, useState} from "react";

export const TdState = () => {
    const [tdOnline, setTdOnline] = useState(false);
    const [ws, setWs] = useState(new WebSocket("ws://localhost:3000"));

    useEffect(() => {
        const webSocket = new WebSocket("ws://localhost:3000")

        ws.onopen = () => {
            setTdOnline(false);
            console.log("Connected to WS server")
            ws.send(JSON.stringify({type: 'role', role: 'EDITOR'}));
        }

        ws.onmessage = (event) => {
            console.log(event.data);
            const data = JSON.parse(event.data);
            if (data.type === 'status') {
                setTdOnline(data.touchDesignerOnline);
            }
        }

        ws.onclose = () => {
            setTdOnline(false);
            console.log("Disconnected from WS server")
        }

        setWs(webSocket)
    }, []);

    if (tdOnline) {
        return <div>Data will be synchronised</div>
    } else {
        return <div>Data will only be stored in the database</div>
    }
}