const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require("./cloudinary");

// Cloudinary Storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "portfolio_images",
        format: async () => 'png',
        public_id: (req, file) => file.originalname.split('.')[0]
    }
});

const upload = multer({ storage });

module.exports = upload;
