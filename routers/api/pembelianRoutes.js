const express = require('express');
const pembelianRouter = express.Router();
const PembelianController = require('../../controllers/pembelianController');
const checkToken = require('../../middlewares/checkToken');

// Create a new Pembelian
pembelianRouter.post('/', checkToken, PembelianController.createPembelian);

// Get all Pembelians
pembelianRouter.get('/', checkToken, PembelianController.getAllPembelians);

// Get a single Pembelian by ID
pembelianRouter.get('/:id', checkToken, PembelianController.getPembelianById);

// Update a Pembelian
pembelianRouter.put('/:id', checkToken, PembelianController.updatePembelian);

// Delete a Pembelian
pembelianRouter.delete('/:id', checkToken, PembelianController.deletePembelian);

module.exports = pembelianRouter;
