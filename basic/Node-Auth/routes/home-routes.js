const express = require('express');
const auth =require('../middleware/auth-middleware');

const router = express.Router();

router.get('/welcome',auth, (req, res) => {
    const{username,userId,role}=req.user;
    res.json({
        user:{
            _id:userId,
            username,
            role
        }
    })
});

module.exports = router;