import {create} from 'zustand';

// Create a shared store
export const useWsStore = create((set, get) => ({
    tdOnline: false,
    ws: null,
    isConnected: false,
    timer: null,

    setTdOnline: (status) => set({tdOnline: status}),
    setWs: (websocket) => set({ws: websocket}),
    setConnected: (connected) => set({isConnected: connected}),

    connect: (role) => {
        const {ws, isConnected} = get();

        // Don't create multiple connections
        if (isConnected || (ws && ws.readyState === WebSocket.OPEN)) {
            ws.send(JSON.stringify({type: 'role', role: role}));
            return;
        }

        const webSocket = new WebSocket("ws://localhost:8080");

        webSocket.onopen = () => {
            set({tdOnline: false, isConnected: true});
            console.log("Connected to WS server");
            webSocket.send(JSON.stringify({type: 'role', role: role}));
        };

        webSocket.onmessage = (event) => {
            console.log(event.data);
            const data = JSON.parse(event.data);
            if (data.type === 'status') {
                set({tdOnline: data.touchDesignerOnline});
            }
            if (data.type === 'timer') {
                set({timer: data.currentSeconds});
            }
        };

        webSocket.onclose = () => {
            set({tdOnline: false, isConnected: false});
            console.log("Disconnected from WS server");
        };

        set({ws: webSocket});
    },

    disconnect: () => {
        const {ws} = get();
        if (ws) {
            ws.close();
        }
        set({ws: null, isConnected: false, tdOnline: false});
    }
}));