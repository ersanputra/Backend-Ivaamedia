const multer = require('multer');
const UploadExcelService = require('../services/UploadExcelService');

const upload = multer({ dest: 'uploads/' });

class UploadExcelController {
    constructor() {
        this.uploadExcelService = new UploadExcelService();
    }

    async uploadFile(req, res) {
        const file = req.file;
        const { marketplace_id } = req.body;

        if (!file) {
            return res.status(400).send("No file uploaded.");
        }

        if (!marketplace_id) {
            return res.status(400).send("Marketplace ID is required.");
        }

        try {
            const apiResults = await this.uploadExcelService.processFile(file, marketplace_id);
            res.json({
                message: `File processed. Success: ${apiResults.success}, Failed: ${apiResults.failed}`,
                errors: apiResults.errors
            });
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    getUploadMiddleware() {
        return upload.single('file');
    }
}

module.exports = UploadExcelController;
