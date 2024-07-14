const express = require('express');
const locationRouter = express.Router();
const LocationController = require('../../controllers/LocationController');

locationRouter.post('/', LocationController.createLocation);
locationRouter.get('/', LocationController.getAllLocations);
locationRouter.get('/:id', LocationController.getLocationById);
locationRouter.get('/user/:userId', LocationController.getLocationByUserId); // New route
locationRouter.put('/:id', LocationController.updateLocation);
locationRouter.delete('/:id', LocationController.deleteLocation);

module.exports = locationRouter;
