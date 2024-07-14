const express = require('express');
const productCategoryRouter = express.Router();
const ProductCategoryController = require('../../controllers/ProductCategoryController');

productCategoryRouter.post('/', ProductCategoryController.createProductCategory);
productCategoryRouter.get('/', ProductCategoryController.getAllProductCategories);
productCategoryRouter.get('/:id', ProductCategoryController.getProductCategoryById);
productCategoryRouter.get('/user/:userId', ProductCategoryController.getProductCategoryByUserId); // New route
productCategoryRouter.put('/:id', ProductCategoryController.updateProductCategory);
productCategoryRouter.delete('/:id', ProductCategoryController.deleteProductCategory);

module.exports = productCategoryRouter;
