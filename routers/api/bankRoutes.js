const express = require('express');
const bankRouter = express.Router();
const BankController = require('../../controllers/BankController');

// Create a new Bank
bankRouter.post('/', BankController.createBank);

// Get all Banks
bankRouter.get('/', BankController.getAllBanks);

// Get a single Bank by ID
bankRouter.get('/:id', BankController.getBankById);

// Get all Banks for a specific user
bankRouter.get('/user/:userId', BankController.getBanksByUserId);

// Update a Bank
bankRouter.put('/:id', BankController.updateBank);

// Delete a Bank
bankRouter.delete('/:id', BankController.deleteBank);

module.exports = bankRouter;
