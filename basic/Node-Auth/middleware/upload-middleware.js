const multer = require("multer");
const path = require("path");

// Set storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "upload/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

// File filter method
function fileFilter(req, file, cb) {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Not an image"));
  }
}

// Initialize upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 5*1024*1024 }, // Limit file size to 5MB
  fileFilter:fileFilter,
})



module.exports = upload;
