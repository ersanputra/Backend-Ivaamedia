const express = require('express');
const kategoriPaymentRouter = express.Router();
const KategoriPaymentController = require('../../controllers/KategoriPaymentController');

// Create a new Kategori Payment
kategoriPaymentRouter.post('/', KategoriPaymentController.createKategoriPayment);

// Get all Kategori Payments
kategoriPaymentRouter.get('/', KategoriPaymentController.getAllKategoriPayments);

// Get a single Kategori Payment by ID
kategoriPaymentRouter.get('/:id', KategoriPaymentController.getKategoriPaymentById);

// Get all Kategori Payments for a specific user
kategoriPaymentRouter.get('/user/:userId', KategoriPaymentController.getKategoriPaymentByUserId);

// Update a Kategori Payment
kategoriPaymentRouter.put('/:id', KategoriPaymentController.updateKategoriPayment);

// Delete a Kategori Payment
kategoriPaymentRouter.delete('/:id', KategoriPaymentController.deleteKategoriPayment);

module.exports = kategoriPaymentRouter;
