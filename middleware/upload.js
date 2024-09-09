// middlewares/upload.js
const multer = require('multer');
const path = require('path');

const storage = multer.memoryStorage(); // Store file in memory buffer

const fileFilter = (req, file, cb) => {
  // Accept only PDFs and docs
  const fileTypes = /pdf|doc|docx/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  if (extname) {
    cb(null, true);
  } else {
    cb(new Error('Only .pdf, .doc, and .docx files are allowed!'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});

module.exports = upload;
