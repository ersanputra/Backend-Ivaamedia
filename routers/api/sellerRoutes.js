const express = require('express');
const sellerRouter = express.Router();
const SellerController = require('../../controllers/sellerController');
const checkToken = require('../../middlewares/checkToken');

// Create a new Seller
sellerRouter.post('/', checkToken, SellerController.createSeller);

// Get all Sellers
sellerRouter.get('/', checkToken, SellerController.getAllSellers);

// Get a single Seller by ID
sellerRouter.get('/:id', checkToken, SellerController.getSellerById);

// Get all Sellers by User ID
sellerRouter.get('/user/:userId', checkToken, SellerController.getSellersByUserId);

// Update a Seller
sellerRouter.put('/:id', checkToken, SellerController.updateSeller);

// Delete a Seller
sellerRouter.delete('/:id', checkToken, SellerController.deleteSeller);

module.exports = sellerRouter;
