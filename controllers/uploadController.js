const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const UploadService = require('../services/uploadService');

class UploadController {
  async uploadFile(req, res) {
    upload.single('photo')(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: 'Failed to upload image', details: err.message });
      }

      try {
        const { userId, description } = req.body;
        const timestamp = new Date().toISOString().replace(/:/g, '-');
        let originalName = req.file.originalname;
        const maxFilenameLength = 200; // Adjust this value as needed to ensure the full filename with timestamp fits within the 255 character limit

        if (originalName.length > maxFilenameLength) {
          const ext = originalName.substring(originalName.lastIndexOf('.'), originalName.length);
          originalName = originalName.substring(0, maxFilenameLength - ext.length) + ext;
        }

        const filename = `${timestamp}-${originalName}`;
        req.file.filename = filename; // Menambahkan nama file dengan timestamp

        const photoUrl = await UploadService.uploadFile(req.file, userId, description);
        res.json({ photoUrl });
      } catch (error) {
        res.status(500).json({ error: 'Failed to upload image to Cloudinary', details: error.message });
      }
    });
  }

  async uploadFilePayments(req, res) {
    upload.single('file')(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: 'Failed to upload file', details: err.message });
      }

      try {
        const { userId, description } = req.body;
        const timestamp = new Date().toISOString().replace(/:/g, '-');
        let originalName = req.file.originalname;
        const maxFilenameLength = 200; // Adjust this value as needed to ensure the full filename with timestamp fits within the 255 character limit

        if (originalName.length > maxFilenameLength) {
          const ext = originalName.substring(originalName.lastIndexOf('.'), originalName.length);
          originalName = originalName.substring(0, maxFilenameLength - ext.length) + ext;
        }

        const filename = `${timestamp}-${originalName}`;
        req.file.filename = filename; // Menambahkan nama file dengan timestamp

        const photoUrl = await UploadService.uploadFilePayments(req.file, userId, description);
        res.json({ photoUrl });
      } catch (error) {
        res.status(500).json({ error: 'Failed to upload file to Cloudinary', details: error.message });
      }
    });
  }

  async uploadFileProfile(req, res) {
    upload.single('file')(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: 'Failed to upload file', details: err.message });
      }

      try {
        const { userId, description } = req.body;
        const timestamp = new Date().toISOString().replace(/:/g, '-');
        let originalName = req.file.originalname;
        const maxFilenameLength = 200; // Adjust this value as needed to ensure the full filename with timestamp fits within the 255 character limit

        if (originalName.length > maxFilenameLength) {
          const ext = originalName.substring(originalName.lastIndexOf('.'), originalName.length);
          originalName = originalName.substring(0, maxFilenameLength - ext.length) + ext;
        }

        const filename = `${timestamp}-${originalName}`;
        req.file.filename = filename; // Menambahkan nama file dengan timestamp

        const photoUrl = await UploadService.uploadFileProfile(req.file, userId, description);
        res.json({ photoUrl });
      } catch (error) {
        res.status(500).json({ error: 'Failed to upload file to Cloudinary', details: error.message });
      }
    });
  }

  async uploadFilePembelian(req, res) {
    upload.single('file')(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: 'Failed to upload file', details: err.message });
      }

      try {
        const { userId, description } = req.body;
        const timestamp = new Date().toISOString().replace(/:/g, '-');
        let originalName = req.file.originalname;
        const maxFilenameLength = 200; // Adjust this value as needed to ensure the full filename with timestamp fits within the 255 character limit

        if (originalName.length > maxFilenameLength) {
          const ext = originalName.substring(originalName.lastIndexOf('.'), originalName.length);
          originalName = originalName.substring(0, maxFilenameLength - ext.length) + ext;
        }

        const filename = `${timestamp}-${originalName}`;
        req.file.filename = filename; // Menambahkan nama file dengan timestamp

        const photoUrl = await UploadService.uploadFilePembelian(req.file, userId, description);
        res.json({ photoUrl });
      } catch (error) {
        res.status(500).json({ error: 'Failed to upload file to Cloudinary', details: error.message });
      }
    });
  }
}

module.exports = new UploadController();
