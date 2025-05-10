const express = require('express');
const router = express.Router();
const { register, login, getUser, logout,getAllUsers } = require('../controllers/authController');
const { protect ,adminOnly} = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, getUser);
router.post('/logout',logout);

// admin
router.get("/userall", protect, adminOnly, getAllUsers);

module.exports = router;
