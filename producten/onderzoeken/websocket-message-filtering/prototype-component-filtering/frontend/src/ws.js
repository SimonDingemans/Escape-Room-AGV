import {create} from "zustand";

export const useWsStore = create((set, get) => ({
    socket: null,
    messages: {},

    connect: async (role) => {
        const {socket, _addMessage, sendMessage} = get();

        await new Promise((resolve) => setTimeout(resolve, 100));

        if (socket && socket.readyState !== WebSocket.CLOSED) {
            _addMessage("Already connected to the server");
            return;
        }

        set({messages: {}});

        _addMessage("Connecting to the server...");

        let s1 = new WebSocket("ws://localhost:3000");

        s1.addEventListener("open", () => {
            _addMessage("Connected to the server");
        });

        s1.addEventListener("message", (event) => {
            _addMessage(event.data, "Server: ");
        });

        s1.addEventListener("close", () => {
            _addMessage("Disconnected from the server");
        });

        s1.addEventListener("error", (event) => {
            _addMessage(event, "Error: ");
        });

        let timeout = 5000;
        while (!!s1.readyState !== true) {
            await new Promise((resolve) => setTimeout(resolve, 5));
            timeout -= 5;
            if (timeout < 0) {
                _addMessage("Error: Connection timed out");
                return;
            }
        }

        set({socket: s1});

        sendMessage(JSON.stringify({type: "role", role: role}), s1);
    },

    disconnect: async () => {
        const {socket, _addMessage} = get();
        if (!socket || socket.readyState === WebSocket.CLOSED) {
            _addMessage("Not connected to any server");
            return;
        }
        _addMessage("Disconnecting from the server...");
        socket.close();
        set({socket: null});
        await new Promise((resolve) => setTimeout(resolve, 1));
    },

    sendMessage: (message, socketOverride = undefined) => {
        const {socket, _addMessage} = get();
        const s = socketOverride ?? socket;
        if (!s || s.readyState !== WebSocket.OPEN) {
            _addMessage("Error: Not connected to a server");
            return;
        }
        if (message) {
            s.send(message);
            _addMessage(message, 'You: ');
        }
    },

    sendFile: (fileInput, typeSelect) => {
        const {socket, _addMessage} = get();
        if (!socket || socket.readyState !== WebSocket.OPEN) {
            _addMessage("Error: Not connected to a server");
            return;
        }

        if (!fileInput.files.length) {
            _addMessage("Error: No file selected");
            return;
        }

        const file = fileInput.files[0];
        const reader = new FileReader();

        reader.onload = function (e) {
            const fileData = new Uint8Array(e.target.result);

            const metadata = {
                type: typeSelect.value, filename: file.name,
            };
            const metadataBytes = new TextEncoder().encode(JSON.stringify(metadata));
            const data = new Uint8Array(4 + metadataBytes.byteLength + fileData.byteLength);
            new DataView(data.buffer).setUint32(0, metadataBytes.byteLength, true); // Little endian

            data.set(metadataBytes, 4);
            data.set(fileData, 4 + metadataBytes.byteLength);

            socket.send(data.buffer);
            get()._addMessage(file.name, 'File sent: ');
        };

        reader.onerror = function () {
            get()._addMessage("Error: Failed to read the file");
        };

        _addMessage(file.name, 'Sending file: ');
        reader.readAsArrayBuffer(file);
    },

    _addMessage: (rawMessage, messagePrefix = '') => {
        set((state) => {
            const fullMessage = messagePrefix + rawMessage;
            console.info(fullMessage)

            const messages = {...state.messages};
            try {
                const parse = JSON.parse(rawMessage);
                const message = parse.message;

                const appendToMessages = (groupId, newMessage) => {
                    const oldMessages = messages[groupId] ?? [];
                    messages[groupId] = [...oldMessages, newMessage];
                }

                if (Array.isArray(message)) {
                    for (let i = 0; i < message.length; i++) {
                        appendToMessages(message[i].id, JSON.stringify(message[i]));
                    }
                } else {
                    appendToMessages(message.id, message.message);
                }
                // eslint-disable-next-line no-unused-vars
            } catch (e) {
                const oldMessages = messages['noId'] ?? [];
                messages['noId'] = [...oldMessages, fullMessage];
            }

            return {messages: messages};
        });
    },

    getMessages: (id) => {
        return get().messages[id];
    }
}));