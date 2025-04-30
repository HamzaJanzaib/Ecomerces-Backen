const express = require('express');
const router = express.Router();
const { registerUser, loginUser, logoutUser, verifiedUser, getUsers, updateUser, deleteUser } = require('../controllers/Auth.Controller');
const { authMiddleware } = require('../Middleware/Auth.Middleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/check-auth', authMiddleware, verifiedUser);



router.get('/getUsers', getUsers);
router.put('/update/:id', updateUser);
router.delete('/delete/:id', deleteUser);


module.exports = router;