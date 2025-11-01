const multer = require('multer');
const path = require('path');

// Storage setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // files will be stored here
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const cleanName = file.originalname.trim(); // remove extra spaces
        cb(null, uniqueSuffix + path.extname(cleanName));
    }

});

const upload = multer({ storage: storage });

module.exports = upload;
