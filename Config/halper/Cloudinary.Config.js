const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
dotenv.config();
const multer = require('multer');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = multer.memoryStorage();

const handleUploadFile = async (file) => {
    try {
        const result = await cloudinary.uploader.upload(file, {
            resource_type: 'auto'
        });
        return result.secure_url;
    } catch (error) {
        console.error('Error uploading file to Cloudinary:', error);
        throw error;
    }
}
const upload = multer({ storage: storage });

module.exports = { upload, handleUploadFile };