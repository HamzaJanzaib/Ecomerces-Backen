const { handleUploadFile } = require('../Config/halper/Cloudinary.Config');
const { ProductsModel } = require('../Config/Models/index');

const handleimageUpload = async (req, res) => {
    try {
        // Check if file exists in the request
        if (!req.file) {
            console.error('No file in request');
            res.status(400).json({
                success: false,
                error: "No file uploaded"
            });
        }

        // Log file details
        console.log('File received:', {
            fieldname: req.file.fieldname,
            originalname: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size,
            buffer: req.file.buffer ? 'Buffer present' : 'No buffer'
        });

        // Convert file buffer to base64
        const b64 = Buffer.from(req.file.buffer).toString('base64');
        const url = `data:${req.file.mimetype};base64,${b64}`;

        // Upload to Cloudinary
        console.log('Uploading to Cloudinary...');
        const result = await handleUploadFile(url);
        console.log('Cloudinary upload successful, URL:', result);

        // Send successful response
        res.status(200).json({
            success: true,
            url: result,
            originalname: req.file.originalname,
            mimetype: req.file.mimetype
        });
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({
            success: false,
            error: "Internal server error",
            details: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
}


 const addProducts = async (req, res) => {
        try {
            const { title, category, brandName, price, description, images, tags, quantity, sku } = req.body;
            const newProduct = await ProductsModel.create({
                title,
                category,
                brandName,
                price,
                description,
                images,
                tags,
                quantity,
                sku
            });
            res.status(201).json({
                success: true,
                message: "Product added successfully",
                data: newProduct
            });
        } catch (error) {
            console.error(error);
            res.json({ status: 500, message: "Internal server error" });
        }
    };

    const getProducts = async (req, res) => {
        try {
            const products = await ProductsModel.find({});
            res.status(200).json({
                success: true,
                message: "Products fetched successfully",
                data: products
            });
        } catch (error) {
            console.error(error);
            res.json({ status: 500, message: "Internal server error" });
        }
    };



    const updateProducts = async (req, res) => {
        try {
            const { id } = req.params;
            const { title, category, brandName, price, description, images, tags, quantity, sku } = req.body;
            const updatedProduct = await ProductsModel.findByIdAndUpdate(id, {
                title,
                category,
                brandName,
                price,
                description,
                images,
                tags,
                quantity,
                sku
            }, { new: true });
            res.status(200).json({
                success: true,
                message: "Product updated successfully",
                data: updatedProduct
            });
        } catch (error) {
            console.error(error);
            res.json({ status: 500, message: "Internal server error" });
        }
    };

    const deleteProducts = async (req, res) => {
        try {
            const { id } = req.params;
            await ProductsModel.findByIdAndDelete(id);
            res.status(200).json({
                success: true,
                message: "Product deleted successfully"
            });
        } catch (error) {
            console.error(error);
            res.json({ status: 500, message: "Internal server error" });
        }
    };


module.exports = { handleimageUpload, addProducts, getProducts, updateProducts, deleteProducts };
