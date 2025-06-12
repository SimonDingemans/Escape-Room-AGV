const {executeQuery, sql} = require("./dbUtils");
const {readFileSync} = require("node:fs");
const {insertDevices} = require("../domain/device/model");

const roles = [
    "OPERATOR",
    "BACKUP_TEAM",
    "TOUCH_DESIGNER",
    "EDITOR"
]

// Need a map to keep track of which client is which role
const clients = new Map();

function broadcast(message, excludeRoles) {
    for (const [role, client] of clients) {
        if (excludeRoles === undefined || !excludeRoles?.includes(role)) {
            client.send(JSON.stringify(message));
        }
    }
}

async function handleJsonMessage(message, ws) {
    const json = JSON.parse(message);
    if (json.type === 'role') {
        const validRole = roles.find(role => role === json.role)

        // All clients must have a valid role
        if (validRole) {
            clients.set(json.role, ws)
            console.log(json.role + " connected")
            if (json.role === "TOUCH_DESIGNER") {
                broadcast({type: 'status', touchDesignerOnline: true}, ["TOUCH_DESIGNER"]);
            } else {
                ws.send(JSON.stringify({type: 'status', touchDesignerOnline: clients.has("TOUCH_DESIGNER")}))
            }
        } else ws.close();
        return;
    }

    // A JSON message must always be from a connection with a role
    const role = hasRole(ws);
    if (!role) return;

    // console.log(json, "sent by ", role);

    if (json.type === 'device') {
        insertDevices(json.message);
        return;
    }

    if (json.type === 'message') {
        const receiver = clients.get(json.receiver);

        delete json.receiver;
        delete json.type;

        json.sender = role;

        if (receiver) receiver.send(JSON.stringify(json));
        else return;
    }

    if (json.type === 'synchronize' && role === "TOUCH_DESIGNER") {
        await synchronizeData();
    }

    if (json.type === 'synchronizeSuccess' && role === "TOUCH_DESIGNER") {
        const eventId = json.eventId;
        updateEventSynchronized(eventId);
    }
}

function handleBinaryMessage(message, ws) {
    // Binary message
    // Sender always editor
    // Receiver is always TouchDesigner)
    const touchDesigner = clients.get("TOUCH_DESIGNER")
    if (!touchDesigner) return;
    touchDesigner.send(message)
}

// Export a function to initialize the WebSocket server
function initializeWebSocketServer(wss) {
    wss.on('connection', function connection(ws) {
        ws.on('message', async function incoming(message) {
            // JSON message
            try {
                await handleJsonMessage(message, ws);

                return;
            } catch (e) {
                // Message not JSON, assume it is binary
            }

            handleBinaryMessage(message, ws);
        });

        // Closed
        ws.on('close', function () {
            const role = hasRole(ws);
            clients.delete(role);
            if (role === "TOUCH_DESIGNER") {
                broadcast({type: 'status', touchDesignerOnline: false}, ["TOUCH_DESIGNER"]);
            }
        });
    });
}

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
            sendFileToTD(readFileSync(`./mediaFiles/${event.media.toLowerCase()}/${fileName}`), {
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

function sendTimerUpdate(currentSeconds) {
    broadcast({type: 'timer', currentSeconds}, ['TOUCH_DESIGNER']);
}

function sendEventUpdate(event, action, playing, speed = 1) {
    const touchDesigner = clients.get("TOUCH_DESIGNER");
    if (!touchDesigner) return;
    touchDesigner.send(JSON.stringify({
        message: [{
            type: 'play',
            media: event.media,
            event: event.file_name,
            action,
            play: playing ? 1 : 0,
            nodeId: event.device,
            speed
        }]
    }));
}

function getDevices() {
    broadcast({"type": "message", "receiver": "TOUCH_DESIGNER", "message": [{"type": "get_audio", "value": 0}]});
    broadcast({"type": "message", "receiver": "TOUCH_DESIGNER", "message": [{"type": "get_monitors", "value": 0}]});
    broadcast({"type": "message", "receiver": "TOUCH_DESIGNER", "message": [{"type": "get_video", "value": 0}]});
}

module.exports = {
    clients,
    synchronizeData,
    sendTimerUpdate,
    sendEventUpdate,
    initializeWebSocketServer,
    getDevices
}
