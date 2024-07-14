const express = require("express");
const inventoryRouter = express.Router();
const InventoryController = require('../../controllers/InventoryController');

inventoryRouter.post('/', InventoryController.createInventory);
inventoryRouter.get('/', InventoryController.getAllInventories);
inventoryRouter.get('/:id', InventoryController.getInventoryById);
inventoryRouter.put('/:id', InventoryController.updateInventory);
inventoryRouter.delete('/:id', InventoryController.deleteInventory);

module.exports = inventoryRouter;
