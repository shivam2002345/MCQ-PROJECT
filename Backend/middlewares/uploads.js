const multer = require("multer");

// Configure Multer for file uploads
const upload = multer({
  dest: "uploads/", // Temporary upload directory
  limits: { fileSize: 2 * 1024 * 1024 }, // Limit file size to 2MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "text/csv") {
      cb(null, true);
    } else {
      cb(new Error("Only CSV files are allowed"), false);
    }
  },
});

module.exports = upload;