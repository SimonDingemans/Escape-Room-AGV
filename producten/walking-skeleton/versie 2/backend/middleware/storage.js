// Create temp upload directory if it doesn't exist
const multer = require('multer');
const path = require('node:path');
const fs = require('node:fs');

const tempUploadDir = path.join(__dirname, './temp-uploads');
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

module.exports = {tempUploadDir, storage, upload }