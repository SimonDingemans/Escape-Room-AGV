const express = require('express');
const router = express.Router();

const path = require('node:path');
const fs = require('node:fs');

// Create temp upload directory if it doesn't exist
const tempUploadDir = path.join(__dirname, '../temp-uploads');
fs.mkdirSync(tempUploadDir, {recursive: true});

// Initialize multer with storage configuration
const { upload } = require("../middleware/storage")
const  Event = require("../domain/event/event")
const {synchronizeData} = require("../utils/wsUtils");
const { insertEvent }= require("../domain/event/model")

// POST endpoint for file upload with metadata
router.post('/upload', upload.single('file'), async (req, res) => {
    const file = req.file;

    if (!file) {
        return res.status(400).json({error: 'No file uploaded'});
    }
    const body = req.body;

    if (!body.media) {
        // Clean up the temporary file
        fs.unlinkSync(file.path);
        return res.status(400).json({error: 'media is required in metadata'});
    }
    let event = new Event(null, body.fase_id,
        body.name, file.filename, body.device_id, body.channel, body.synchronized, body.type,
        body.media, body.starting_seconds, body.ending_seconds
    )

    // Create the destination directory based on media if it doesn't exist'
    const destDir = path.join(__dirname, '../mediaFiles', event.media.toLowerCase());
    fs.mkdirSync(destDir, {recursive: true});


    try {
        // Upload the event to the database
        event =  await insertEvent(event);

    } catch (error) {
        // Clean up the temporary file if database operation fails
        fs.unlinkSync(file.path);
        return res.status(500).json({error: error.message});
    }

    try {
        // Create new file path
        const newFilePath = path.join(destDir, file.filename);

        // Move the file from temp directory to final destination
        fs.renameSync(file.path, newFilePath);

        // Update the file path for response
        const updatedPath = newFilePath;

        await synchronizeData()

        // Return success response with file metadata
        return res.status(200).json({
            message: 'File uploaded successfully',
            file: {
                filename: file.filename,
                originalName: file.originalname,
                path: updatedPath,
                size: file.size,
                media: event.media
            },
            event: event,
            // Return any additional metadata that was included
            metadata: body
        });
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
});

module.exports = router;
