const multer = require("multer");
const maxSize = 1 * 1024 * 1024; // for 1MB

const upload = multer({
  dest: "src/uploads/",
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg" ||
      file.mimetype == "application/pdf"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
    }
  },
  limits: { fileSize: maxSize * 10 },
});

const uploadSingleImg = upload.single("file");

const uploadMulter = {
  upload,
  uploadSingleImg,
};

module.exports = uploadMulter;