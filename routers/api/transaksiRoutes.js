const express = require('express');
const transaksiRouter = express.Router();
const TransaksiController = require('../../controllers/TransaksiController');
const checkToken = require('../../middlewares/checkToken');

// Create a new Transaksi
transaksiRouter.post('/', checkToken, TransaksiController.createTransaksi);

// Get all Transaksi
transaksiRouter.get('/', checkToken, TransaksiController.getAllTransaksi);

// Get a single Transaksi by ID
transaksiRouter.get('/:id', checkToken, TransaksiController.getTransaksiById);

// Get all Transaksi for a specific user
transaksiRouter.get('/user/:userId', checkToken, TransaksiController.getTransaksiByUserId);

// Update a Transaksi
transaksiRouter.put('/:id', checkToken, TransaksiController.updateTransaksi);

// Delete a Transaksi
transaksiRouter.delete('/:id', checkToken, TransaksiController.deleteTransaksi);

module.exports = transaksiRouter;
