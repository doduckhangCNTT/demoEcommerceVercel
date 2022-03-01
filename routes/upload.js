const router = require('express').Router();
const auth = require('../middleware/auth');
const authAdmin = require('../middleware/authAdmin');
const fs = require('fs');
const cloudinary = require('cloudinary');

// Cau hinh de co the truy cap len cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});
router.post('/upload', auth, authAdmin, async (req, res) => {
  try {
    console.log(req.files);
    // Kiem tra file gui len co dung yeu cau hay ko
    if (!req.files || Object.keys(req.files).length == 0) {
      removeTmp(file.tempFilePath);
      return res
        .status(400)
        .json({ success: false, message: 'No image uploaded' });
    }

    const file = req.files.file;
    // Kiem tra chat luong anh gui len
    if (file.size > 1024 * 1024) {
      removeTmp(file.tempFilePath);

      return res
        .status(400)
        .json({ success: false, message: 'Image is too large' });
    }

    // Image type
    if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png') {
      removeTmp(file.tempFilePath);

      return res
        .status(400)
        .json({ success: false, message: 'Image is not a valid' });
    }

    cloudinary.v2.uploader.upload(
      file.tempFilePath,
      { folder: 'demo' },
      (err, result) => {
        if (err) throw err;
        res.json(result);
        // res.json({ public_id: result.public_id, url: result.secure_url });
      }
    );
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/destroy', auth, authAdmin, (req, res) => {
  try {
    const { public_id } = req.body;
    if (!public_id) {
      return res
        .status(404)
        .json({ success: false, message: 'No images selected' });
    }
    cloudinary.v2.uploader.destroy(public_id, (err, result) => {
      if (err) throw err;
      res.json({ success: true, message: 'Deleted image' });
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

const removeTmp = (path) => {
  fs.unlink(path, (err) => {
    if (err) throw err;
  });
};

module.exports = router;
