// server.js
const express = require('express');

const app = express();
const cors = require('cors');

const http = require('http');
const WebSocket = require('ws');
const server = http.createServer(app);

// Import WebSocket logic from wsUtils.js
const { initializeWebSocketServer } = require('./utils/wsUtils');

// Include route files
const scenarioRoute = require('./routes/scenario.js');
const eventRoute = require('./routes/event.js');
const deviceRoute = require('./routes/device.js');
const escapeRoomRoute = require('./routes/escapeRoom.js');

const corsOptions = {
    origin: ['http://localhost:5173', 'http://localhost:4173'],
};

app.use(express.json())

app.use(cors(corsOptions));

// Use routes
app.use('/scenario', scenarioRoute);
app.use('/event', eventRoute);
app.use('/device', deviceRoute);
app.use('/escaperoom', escapeRoomRoute);

// Initialize WebSocket server on the same HTTP server
const wss = new WebSocket.Server({ server });
initializeWebSocketServer(wss);

const PORT = process.env.PORT || 8080;

// Start the server (both HTTP and WebSocket)
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`HTTP server available at http://localhost:${PORT}`);
    console.log(`WebSocket server available at ws://localhost:${PORT}`);
});