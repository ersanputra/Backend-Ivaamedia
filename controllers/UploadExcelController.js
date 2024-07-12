const multer = require('multer');
const UploadExcelServiceShopee = require('../services/UploadExcelServiceShopee');
const UploadExcelServiceTiktok = require('../services/UploadExcelServiceTiktok');


const upload = multer({ dest: 'uploads/' });

class UploadExcelController {
    constructor() {
        this.uploadExcelServiceShopee = new UploadExcelServiceShopee();
        this.uploadExcelServiceTiktok = new UploadExcelServiceTiktok();
    }

    async uploadFileShopee(req, res) {
        const file = req.file;
        const { marketplace_id } = req.body;
    
        if (!file) {
            return res.status(400).send("No file uploaded.");
        }
    
        if (!marketplace_id) {
            return res.status(400).send("Marketplace ID is required.");
        }
    
        try {
            const apiResults = await this.uploadExcelServiceShopee.processFile(file, marketplace_id);
            res.json({
                message: `File processed. Success: ${apiResults.success}, Failed: ${apiResults.failed}`,
                errors: apiResults.errors
            });
        } catch (error) {
            res.status(500).json({ message: error.message, stack: error.stack });
        }
    }
    
    async uploadFileTiktok(req, res) {
        const file = req.file;
        const { marketplace_id } = req.body;
    
        if (!file) {
            return res.status(400).send("No file uploaded.");
        }
    
        if (!marketplace_id) {
            return res.status(400).send("Marketplace ID is required.");
        }
    
        try {
            const apiResults = await this.uploadExcelServiceTiktok.processFile(file, marketplace_id);
            res.json({
                message: `File processed. Success: ${apiResults.success}, Failed: ${apiResults.failed}`,
                errors: apiResults.errors
            });
        } catch (error) {
            res.status(500).json({ message: error.message, stack: error.stack });
        }
    }
   

    getUploadMiddleware() {
        return upload.single('file');
    }
}

module.exports = UploadExcelController;
