const express = require("express");
const inventoryRouter = express.Router();
const InventoryController = require('../../controllers/InventoryController');
const checkToken = require('../../middlewares/checkToken');

// Apply checkToken middleware to all routes
inventoryRouter.post('/', checkToken, InventoryController.createInventory);
inventoryRouter.get('/', checkToken, InventoryController.getAllInventories);
inventoryRouter.get('/:id', checkToken, InventoryController.getInventoryById);
inventoryRouter.put('/:id', checkToken, InventoryController.updateInventory);
inventoryRouter.delete('/:id', checkToken, InventoryController.deleteInventory);
inventoryRouter.get('/user/:userId', checkToken, InventoryController.getInventoriesByUserId);

module.exports = inventoryRouter;
