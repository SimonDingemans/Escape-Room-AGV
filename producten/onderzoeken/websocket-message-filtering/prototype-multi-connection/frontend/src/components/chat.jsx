import './chat.css';
import { useEffect } from "react";
import useWebSocketStore from "../ws.js";

export const Chat = ({ id }) => {
    // Create the role string from the ID
    const role = `OPERATOR:${id}`;

    // Use a selector function that only returns what we need based on role
    const messages = useWebSocketStore(state => state.getMessagesByRole(role));

    // Get functions separately to avoid unnecessary re-renders
    const connect = useWebSocketStore(state => state.connect);
    const disconnect = useWebSocketStore(state => state.disconnect);

    useEffect(() => {
        let mounted = true;

        const connectToServer = async () => {
            if (!mounted) return;

            // Disconnect if already connected
            await disconnect(role);

            // Connect with the role as the identifier
            await connect(role);
        };

        connectToServer();

        // Cleanup on unmount
        return () => {
            mounted = false;
            disconnect(role);
        };
    }, [role]);

    return (
        <aside className="chat">
            <h1>Messages for {id} side</h1>
            {messages.map((message, index) => (
                <p key={index}>{message}</p>
            ))}
        </aside>
    );
};