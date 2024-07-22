const express = require('express');
const uploadRouter = express.Router();
const UploadController  = require('../../controllers/uploadController');

uploadRouter.post('/inventory', (req, res) => UploadController.uploadFile(req, res));

uploadRouter.post('/payments', (req, res) => UploadController.uploadFilePayments(req, res));

uploadRouter.post('/profile', (req, res) => UploadController.uploadFileProfile(req, res));

module.exports = uploadRouter;
