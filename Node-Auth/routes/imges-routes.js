const express = require('express');
const authMiddleware = require('../middleware/auth-middleware');
const adminMiddleware = require('../middleware/admin-middleware');
const uploadMIddleware = require('../middleware/upload-middleware');
const {uploadImageController,fetchImagesController,deleteImagesController} =require('../controllers/image-controller')
const fs = require('fs');
const path = require('path');

const router = express.Router();




// Upload image route
router.post('/upload',authMiddleware,adminMiddleware,uploadMIddleware.single('image'), uploadImageController);

router.get('/getAllImages',authMiddleware,fetchImagesController);

router.delete('/deleteImage/:id',authMiddleware,deleteImagesController);

// Get all images route
// router.get('/images', (req, res) => {
//     const directoryPath = path.join(__dirname, '../uploads');

//     fs.readdir(directoryPath, (err, files) => {
//         if (err) {
//             return res.status(500).json({ error: 'Unable to scan files' });
//         }

//         const images = files.map(file => ({
//             name: file,
//             url: `${req.protocol}://${req.get('host')}/uploads/${file}`
//         }));

//         res.status(200).json(images);
//     });
// });

module.exports = router;