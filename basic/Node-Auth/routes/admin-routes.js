const express = require('express');
const authMiddleware = require('../middleware/auth-middleware');
const adminMiddleware = require('../middleware/admin-middleware');

const router = express.Router();

router.get('/welcome',authMiddleware,adminMiddleware, (req, res) => {
    res.send('Welcome to the Admin Panel');
});

module.exports = router;