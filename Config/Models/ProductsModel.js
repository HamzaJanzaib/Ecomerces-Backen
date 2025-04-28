const mongoose = require("mongoose");

const arrayLimit = (val) => {
    return val.length <= 5;
};

const productsSchema = new mongoose.Schema({
        title: String,
        category: {
            type: String,
            required: true,
            enum: ['men', 'women', 'kids', 'home', 'beauty', 'electronics', 'sports', 'toys', 'books', 'other']
        },
        brandName: String,
        price: Number,
        description: String,
        images: {
            type: [String],
            required: true,
            validate: [arrayLimit, '{PATH} exceeds the limit of 5']
        },
        tags: String,
        quantity: Number,
        sku : String,
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Product", productsSchema);
