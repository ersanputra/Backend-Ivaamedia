const express = require('express');
const productCategoryRouter = express.Router();
const ProductCategoryController = require('../../controllers/ProductCategoryController');
const checkToken = require('../../middlewares/checkToken');

// Create a new Product Category
productCategoryRouter.post('/', checkToken, ProductCategoryController.createProductCategory);

// Get all Product Categories
productCategoryRouter.get('/', checkToken, ProductCategoryController.getAllProductCategories);

// Get a single Product Category by ID
productCategoryRouter.get('/:id', checkToken, ProductCategoryController.getProductCategoryById);

// Get all Product Categories for a specific user
productCategoryRouter.get('/user/:userId', checkToken, ProductCategoryController.getProductCategoryByUserId);

// Update a Product Category
productCategoryRouter.put('/:id', checkToken, ProductCategoryController.updateProductCategory);

// Delete a Product Category
productCategoryRouter.delete('/:id', checkToken, ProductCategoryController.deleteProductCategory);

module.exports = productCategoryRouter;
