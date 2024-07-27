const express = require('express');
const locationRouter = express.Router();
const LocationController = require('../../controllers/LocationController');
const checkToken = require('../../middlewares/checkToken');

// Create a new Location
locationRouter.post('/', checkToken, LocationController.createLocation);

// Get all Locations
locationRouter.get('/', checkToken, LocationController.getAllLocations);

// Get a single Location by ID
locationRouter.get('/:id', checkToken, LocationController.getLocationById);

// Get all Locations for a specific user
locationRouter.get('/user/:userId', checkToken, LocationController.getLocationByUserId);

// Update a Location
locationRouter.put('/:id', checkToken, LocationController.updateLocation);

// Delete a Location
locationRouter.delete('/:id', checkToken, LocationController.deleteLocation);

module.exports = locationRouter;
