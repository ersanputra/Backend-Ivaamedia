const express = require('express');
const userBusinessRouter = express.Router();
const UserBusinessController = require('../../controllers/UserBusinessController');

// Create a new UserBusiness
userBusinessRouter.post('/', UserBusinessController.createUserBusiness);

// Get all UserBusinesses
userBusinessRouter.get('/', UserBusinessController.getAllUserBusinesses);

// Get a single UserBusiness by ID
userBusinessRouter.get('/:id', UserBusinessController.getUserBusinessById);

// Get all UserBusinesses for a specific user
userBusinessRouter.get('/user/:userId', UserBusinessController.getUserBusinessesByUserId);

// Update a UserBusiness
userBusinessRouter.put('/:id', UserBusinessController.updateUserBusiness);

// Delete a UserBusiness
userBusinessRouter.delete('/:id', UserBusinessController.deleteUserBusiness);

module.exports = userBusinessRouter;
