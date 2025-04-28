const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
        fullname: String,
        email: { type: String, unique: true },
        password: String,
        number: String,
        address: String,
        city: String,
        country: String,
        dob: String,
        role: { type: String, default: 'user' },
        userOrders : [{type : mongoose.Schema.Types.ObjectId, ref : 'orders'}], 
        profileImage: String,
        createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", UserSchema);
