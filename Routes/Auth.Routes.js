const express = require('express');
const router = express.Router();
const { registerUser, loginUser, logoutUser } = require('../controllers/Auth.Controller');
const { authMiddleware } = require('../Middleware/Auth.Middleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/check-auth', authMiddleware, (req, res) => {
    try {
        const user = req.user;
        res.status(200).json({ success: "success", message: "User is authenticated", user });
    } catch (error) {
            res.status(500).json({ success: "failed", message: "Internal server error" });
    }
});




module.exports = router;