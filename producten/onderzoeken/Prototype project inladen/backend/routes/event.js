const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('node:path');
const fs = require('node:fs');
const {executeQuery, sql} = require("../utils/dbUtils");

const {synchronizeData} = require("../config/ws");

// Create temp upload directory if it doesn't exist
const tempUploadDir = path.join(__dirname, '../temp-uploads');
fs.mkdirSync(tempUploadDir, {recursive: true});

// Configure storage for multer
const storage = multer.diskStorage({
    filename: function (req, file, cb) {
        // Generate a unique filename with original extension
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname);
        cb(null, file.originalname.split('.')[0] + '-' + uniqueSuffix + extension);
    }
});

// Initialize multer with storage configuration
const upload = multer({storage: storage});

// POST endpoint for file upload with metadata
router.post('/upload', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({error: 'No file uploaded'});
    }
    const body = req.body;

    if (!body.mediaType) {
        // Clean up the temporary file
        fs.unlinkSync(req.file.path);
        return res.status(400).json({error: 'mediaType is required in metadata'});
    }
    const mediaType = body.mediaType;

    // Create the destination directory based on mediaType if it doesn't exist'
    const destDir = path.join(__dirname, '../mediaFiles', mediaType.toLowerCase());
    fs.mkdirSync(destDir, {recursive: true});

    try {
        // Upload the event to the database
        await executeQuery(
            `
                INSERT INTO events (fase_id, name, file_name, device_id, channel, synchronized, type, media,
                                    starting_seconds, ending_seconds)
                VALUES (@faseId, @name, @fileName, @deviceId, @channel, 0, @type, @media, @startingSeconds,
                        @endingSeconds)
            `,
            [
                {name: 'faseId', type: sql.Int, value: body.faseId},
                {name: 'name', type: sql.VarChar, value: body.name},
                {name: 'fileName', type: sql.VarChar, value: req.file.filename},
                {name: 'deviceId', type: sql.TinyInt, value: body.deviceId},
                {name: 'channel', type: sql.TinyInt, value: body.channel},
                {name: 'type', type: sql.VarChar, value: body.type},
                {name: 'media', type: sql.VarChar, value: body.mediaType},
                {name: 'startingSeconds', type: sql.SmallInt, value: body.startingSeconds},
                {name: 'endingSeconds', type: sql.SmallInt, value: body.endingSeconds}
            ]);
    } catch (error) {
        // Clean up the temporary file if database operation fails
        fs.unlinkSync(req.file.path);
        return res.status(500).json({error: error.message});
    }

    try {
        // Create new file path
        const newFilePath = path.join(destDir, req.file.filename);

        // Move the file from temp directory to final destination
        fs.renameSync(req.file.path, newFilePath);

        // Update the file path for response
        const updatedPath = newFilePath;

        synchronizeData()

        // Return success response with file metadata
        return res.status(200).json({
            message: 'File uploaded successfully',
            file: {
                filename: req.file.filename,
                originalName: req.file.originalname,
                path: updatedPath,
                size: req.file.size,
                mediaType: mediaType
            },
            // Return any additional metadata that was included
            metadata: req.body
        });
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
});

module.exports = router;
