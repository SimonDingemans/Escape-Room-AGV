const express = require('express');
const router = express.Router();
const {getDevices} = require("../utils/wsUtils");
const {getDevicesFromDatabase} = require("../domain/device/model")
const {message} = require("multer/lib/multer-error");

router.post('/', (req, res)  => {
    try {
        getDevices();
    } catch (e) {
        console.log(e)
        res.status(500).json({ error: e.message });
    }

});

// Define a route
router.get('/', async (req, res) => {
    try {
        const devices = await getDevicesFromDatabase();
        res.send(devices);
    } catch (e) {
        return res.status(500).json({error: message});
    }
});

module.exports = router;