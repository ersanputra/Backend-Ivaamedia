const express = require('express');
const bankRouter = express.Router();
const BankController = require('../../controllers/BankController');
const checkToken = require('../../middlewares/checkToken');

// Create a new Bank
bankRouter.post('/', checkToken, BankController.createBank);

// Get all Banks
bankRouter.get('/', checkToken, BankController.getAllBanks);

// Get a single Bank by ID
bankRouter.get('/:id', checkToken, BankController.getBankById);

// Get all Banks for a specific user
bankRouter.get('/user/:userId', checkToken, BankController.getBanksByUserId);

// Update a Bank
bankRouter.put('/:id', checkToken, BankController.updateBank);

// Delete a Bank
bankRouter.delete('/:id', checkToken, BankController.deleteBank);

module.exports = bankRouter;
