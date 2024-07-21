const express = require('express');
const transaksiRouter = express.Router();
const TransaksiController = require('../../controllers/TransaksiController');

transaksiRouter.post('/', TransaksiController.createTransaksi);
transaksiRouter.get('/', TransaksiController.getAllTransaksi);
transaksiRouter.get('/:id', TransaksiController.getTransaksiById);
transaksiRouter.get('/user/:userId', TransaksiController.getTransaksiByUserId); // New route
transaksiRouter.put('/:id', TransaksiController.updateTransaksi);
transaksiRouter.delete('/:id', TransaksiController.deleteTransaksi);

module.exports = transaksiRouter;
