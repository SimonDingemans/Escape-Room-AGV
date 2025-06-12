import { create } from 'zustand';

// Create a store that manages multiple websocket connections
const useWebSocketStore = create((set, get) => ({
    // Store connections in an array
    connections: [],

    // Store messages in an object structure
    messages: {},

    // Add a message to a specific connection
    addMessage: (role, message) => {
        console.info(`[${role}] ${message}`);
        set(state => {
            // Create a new messages object to ensure proper state updates
            const newMessages = { ...state.messages };
            const connectionMessages = newMessages[role] || [];
            newMessages[role] = [...connectionMessages, message];
            return { messages: newMessages };
        });
    },

    // Find connection by role
    getConnection: (role) => {
        return get().connections.find(conn => conn.role === role);
    },

    // Connect to a WebSocket with a specific role
    connect: async (role) => {
        const { getConnection, addMessage } = get();

        await new Promise(resolve => setTimeout(resolve, 100));

        // Check if already connected
        const existingConnection = getConnection(role);
        if (existingConnection && existingConnection.socket.readyState !== WebSocket.CLOSED) {
            addMessage(role, 'Already connected to the server');
            return;
        }

        // Clear previous messages for this connection
        set(state => ({
            messages: {
                ...state.messages,
                [role]: []
            }
        }));

        addMessage(role, 'Connecting to the server...');

        // Create new WebSocket
        const socket = new WebSocket('ws://localhost:3000');

        // Connection opened
        socket.addEventListener('open', () => {
            addMessage(role, 'Connected to the server');
        });

        // Listen for messages
        socket.addEventListener('message', (event) => {
            addMessage(role, `Server: ${event.data}`);
        });

        // Connection closed
        socket.addEventListener('close', () => {
            addMessage(role, 'Disconnected from the server');
        });

        // Connection error
        socket.addEventListener('error', (event) => {
            addMessage(role, `Error: ${event}`);
        });

        // Wait for connection to be established
        let timeout = 5000;
        while (!!socket.readyState !== true) {
            await new Promise(resolve => setTimeout(resolve, 5));
            timeout -= 5;
            if (timeout < 0) {
                addMessage(role, 'Error: Connection timed out');
                return;
            }
        }

        // Store the connection in array
        set(state => {
            // Remove any existing connection with the same role
            const filteredConnections = state.connections.filter(conn => conn.role !== role);
            // Add the new connection
            return {
                connections: [...filteredConnections, { socket, role }]
            };
        });

        // Send initial role message
        get().sendMessage(role, JSON.stringify({ type: 'role', role }));
    },

    // Disconnect a specific connection
    disconnect: async (role) => {
        const { getConnection, addMessage } = get();
        const connection = getConnection(role);

        if (!connection || connection.socket.readyState === WebSocket.CLOSED) {
            addMessage(role, 'Not connected to any server');
            return;
        }

        addMessage(role, 'Disconnecting from the server...');
        connection.socket.close();

        // Remove socket from connections
        set(state => ({
            connections: state.connections.filter(conn => conn.role !== role)
        }));

        return await new Promise(resolve => setTimeout(resolve, 1));
    },

    // Send a message through a specific connection
    sendMessage: (role, message) => {
        const { getConnection, addMessage } = get();
        const connection = getConnection(role);

        if (!connection || connection.socket.readyState !== WebSocket.OPEN) {
            addMessage(role, 'Error: Not connected to a server');
            return;
        }

        if (message) {
            connection.socket.send(message);
            addMessage(role, `You: ${message}`);
        }
    },

    // Send a file through a specific connection
    sendFile: (role, fileInput, typeSelect) => {
        const { getConnection, addMessage } = get();
        const connection = getConnection(role);

        if (!connection || connection.socket.readyState !== WebSocket.OPEN) {
            addMessage(role, 'Error: Not connected to a server');
            return;
        }

        if (!fileInput.files.length) {
            addMessage(role, 'Error: No file selected');
            return;
        }

        const file = fileInput.files[0];
        const reader = new FileReader();

        reader.onload = function (e) {
            const fileData = new Uint8Array(e.target.result);

            const metadata = {
                type: typeSelect.value,
                filename: file.name
            };

            // Convert metadata to bytes
            const metadataBytes = new TextEncoder().encode(JSON.stringify(metadata));

            // Calculate total size needed for the combined data
            const data = new Uint8Array(4 + metadataBytes.byteLength + fileData.byteLength);

            // Write a 4-byte header containing metadata length
            new DataView(data.buffer).setUint32(0, metadataBytes.byteLength, true); // Little-endian

            // Assemble the final binary package
            data.set(metadataBytes, 4);
            data.set(fileData, 4 + metadataBytes.byteLength);

            connection.socket.send(data.buffer);
            addMessage(role, `File sent: ${file.name}`);
        };

        reader.onerror = function () {
            addMessage(role, 'Error: Failed to read the file');
        };

        addMessage(role, `Sending file: ${file.name}`);
        reader.readAsArrayBuffer(file);
    },

    // Get messages for a specific role
    getMessagesByRole: (role) => {
        return get().messages[role] || [];
    }
}));

export default useWebSocketStore;