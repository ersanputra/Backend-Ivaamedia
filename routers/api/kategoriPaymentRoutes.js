const express = require('express');
const kategoriPaymentRouter = express.Router();
const KategoriPaymentController = require('../../controllers/KategoriPaymentController');
const checkToken = require('../../middlewares/checkToken');

// Create a new Kategori Payment
kategoriPaymentRouter.post('/', checkToken, KategoriPaymentController.createKategoriPayment);

// Get all Kategori Payments
kategoriPaymentRouter.get('/', checkToken, KategoriPaymentController.getAllKategoriPayments);

// Get a single Kategori Payment by ID
kategoriPaymentRouter.get('/:id', checkToken, KategoriPaymentController.getKategoriPaymentById);

// Get all Kategori Payments for a specific user
kategoriPaymentRouter.get('/user/:userId', checkToken, KategoriPaymentController.getKategoriPaymentByUserId);

// Update a Kategori Payment
kategoriPaymentRouter.put('/:id', checkToken, KategoriPaymentController.updateKategoriPayment);

// Delete a Kategori Payment
kategoriPaymentRouter.delete('/:id', checkToken, KategoriPaymentController.deleteKategoriPayment);

module.exports = kategoriPaymentRouter;
