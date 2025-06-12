// server.js
const express = require('express');
// require('./config/ws');
const cors = require('cors');
const app = express();

// Include route files
const scenarioRoute = require('./routes/scenario.js');
const eventRoute = require('./routes/event.js');

//Set up cors
const corsOptions = {
    origin: 'http://localhost:5173',
};

app.use(express.json())

app.use(cors(corsOptions));

// Use routes
app.use('/scenario', scenarioRoute);
app.use('/event', eventRoute);

const PORT = process.env.PORT || 8080;

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
