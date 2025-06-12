const WebSocket = require('ws');
const {executeQuery, sql} = require("../utils/dbUtils");
const {readFileSync} = require("node:fs");

const roles = [
    "OPERATOR",
    "BACKUP_TEAM",
    "TOUCH_DESIGNER",
    "EDITOR"
]

const wss = new WebSocket.Server({port: 3000});

// Need a map to keep track of which client is which role
const clients = new Map();

function broadcast(message, excludeRole = null) {
    for (const [role, client] of clients) {
        if (role !== excludeRole) {
            client.send(JSON.stringify(message));
        }
    }
}

wss.on('connection', function connection(ws) {
    ws.on('message', async function incoming(message) {
        // JSON message
        // console.log(message)
        try {
            const json = JSON.parse(message);
            if (json.type === 'role') {
                const validRole = roles.find(role => role === json.role)

                // All clients must have a valid role
                if (validRole) {
                    clients.set(json.role, ws)
                    console.log(json.role + " connected")
                    if (json.role === "TOUCH_DESIGNER") {
                        broadcast({type: 'status', touchDesignerOnline: true}, "TOUCH_DESIGNER");
                    } else {
                        ws.send(JSON.stringify({type: 'status', touchDesignerOnline: clients.has("TOUCH_DESIGNER")}))
                    }
                } else ws.close();
                return;
            }

            // A JSON message must always be from a connection with a role
            const role = hasRole(ws);
            if (!role) return;

            if (json.type === 'message') {
                const receiver = clients.get(json.receiver);

                delete json.receiver;
                delete json.type;

                json.sender = role;

                if (receiver) receiver.send(JSON.stringify(json));
                else return;
            }

            if (json.type === 'synchronize' && role === "TOUCH_DESIGNER") {
                // TODO
                // Later check all events in TD and compare with events in DB.
                // Force all events that are not in the DB to be deleted in TD.
                // Force all events that are not in the DB to be created in TD.

                await synchronizeData();
            }

            if (json.type === 'synchronizeSuccess' && role === "TOUCH_DESIGNER") {
                const eventId = json.eventId;
                updateEventSynchronized(eventId);
            }
            return;
        } catch (e) {
            // Message not JSON, assume it is binary
        }

        // Binary message
        // Sender always editor
        // Receiver is always TouchDesigner)
        const touchDesigner = clients.get("TOUCH_DESIGNER")
        if (!touchDesigner) return;
        touchDesigner.send(message)
    });

    // Closed
    ws.on('close', function () {
        const role = hasRole(ws);
        clients.delete(role);
        if (role === "TOUCH_DESIGNER") {
            broadcast({type: 'status', touchDesignerOnline: false}, "TOUCH_DESIGNER");
        }
    });
});

function hasRole(ws) {
    for (const [role, client] of clients) {
        if (client === ws) return role;
    }
    return null;
}

function sendFileToTD(fileData, metadata) {
    const touchDesigner = clients.get("TOUCH_DESIGNER");
    try {
        const metadataBuffer = Buffer.from(JSON.stringify(metadata));
        const dataBuffer = Buffer.alloc(4 + metadataBuffer.byteLength + fileData.byteLength);

        dataBuffer.writeUInt32LE(metadataBuffer.byteLength, 0);

        metadataBuffer.copy(dataBuffer, 4);
        fileData.copy(dataBuffer, 4 + metadataBuffer.byteLength);

        touchDesigner.send(dataBuffer);
    } catch (error) {
        console.error(`Error sending file ${metadata.fileName}:`, error);
    }

}

async function synchronizeData() {
    if (clients.has("TOUCH_DESIGNER")) {
        console.log("Synchronizing data")
        const toSynchronizeEvents = await executeQuery('SELECT id, fase_id, name, device_id, channel, file_name, media FROM events WHERE synchronized = 0');

        for (const event of toSynchronizeEvents.recordset) {
            const fileName = event.file_name;
            sendFileToTD(readFileSync(`./mediaFiles/${event.media}/${fileName}`), {
                mediaType: event.media,
                filename: event.file_name,
                faseId: event.fase_id,
                eventId: event.id,
            })
        }
    }
}

async function updateEventSynchronized(eventId) {
    await executeQuery('UPDATE events SET synchronized = 1 WHERE id = @id', [{
        name: 'id',
        type: sql.Int,
        value: eventId
    }]);
}

module.exports = {
    clients,
    synchronizeData
};