const WebSocket = require('ws');

const roles = [
    "OPERATOR",
    "BACKUP_TEAM",
    "TOUCH_DESIGNER",
    "EDITOR"
]

const wss = new WebSocket.Server({port: 3000});

// Need a map to keep track of which client is which role
const clients = new Map();

wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        // JSON message
        console.log(message)
        try {
            const json = JSON.parse(message);
            if (json.type === 'role') {
                const validRole = roles.find(role => role === json.role)

                // All clients must have a valid role
                if (validRole) clients.set(json.role, ws)
                else ws.close();
                return;
            }

            // A JSON message must always be from a connection with a role
            const role = hasRole(ws);
            if (!role) return ws.close();

            if (json.type === 'message') {
                const receiver = clients.get(json.receiver);

                delete json.receiver;
                delete json.type;

                json.sender = role;

                if (receiver) receiver.send(JSON.stringify(json));
                else return ws.close();
            }
            return;
        } catch (e) {
            // Message not JSON, assume it is binary
        }

        // Binary message
        // Sender always editor
        // Receiver is always TouchDesigner)
        const touchDesigner = clients.get("TOUCH_DESIGNER")
        touchDesigner.send(message)
    });

    // Closed
    ws.on('close', function () {
        const role = hasRole(ws);
        clients.delete(role);
    });
});

function hasRole(ws) {
    for (const [role, client] of clients) {
        if (client === ws) return role;
    }
    return null;
}