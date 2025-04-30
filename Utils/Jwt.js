const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
dotenv.config();

module.exports.createToken = async (user) => {
    const payload = { email: user.email, id: user._id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "10h" });
    return token;
};

module.exports.verifyToken = async (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded;
    } catch (error) {   
        if (error instanceof jwt.TokenExpiredError) {
            console.error("Token has expired:", error.message);
            throw new Error("Token expired");
        } else if (error instanceof jwt.JsonWebTokenError) {
            console.error("Invalid token:", error.message);
            throw new Error("Invalid token");
        } else {
            console.error("Token verification failed:", error.message);
            throw new Error("Token verification failed");
        }
    }
};
