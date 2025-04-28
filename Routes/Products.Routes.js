const express = require('express');
const router = express.Router();

const { handleimageUpload, addProducts, getProducts, updateProducts, deleteProducts } = require('../controllers/Products.controllers');
const { upload } = require('../Config/halper/Cloudinary.Config');

router.post('/image-upload', upload.single('image'), handleimageUpload);
router.post('/Add', addProducts);
router.get('/Get', getProducts);
router.put('/Update/:id', updateProducts);
router.delete('/Delete/:id', deleteProducts);

module.exports = router;