const { verifyToken } = require("../Utils/Jwt");

module.exports.authMiddleware = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ status: "failed", message: "Unauthorized: No token provided" });
    }
    try {
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        console.error("Token verification failed:", error);
        return res.status(401).json({ status: "failed", message: "Unauthorized: Invalid token" });
    }
}