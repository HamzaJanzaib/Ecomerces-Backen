const { verifyToken } = require("../Utils/Jwt");
const { UserModel } = require("../Config/Models/index");

module.exports.authMiddleware = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ status: "failed", message: "Unauthorized: No token provided" });
    }
    try {
        const decoded = verifyToken(token);
        req.user = decoded;
        req.token = token;
        next();
    } catch (error) {
        console.error("Token verification failed:", error);
        return res.status(401).json({ status: "failed", message: "Unauthorized: Invalid token" });
    }
}