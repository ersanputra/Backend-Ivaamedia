const LocationService = require('../services/LocationService');
const locationService = new LocationService();

class LocationController {
  static async createLocation(req, res) {
    try {
      const location = await locationService.createLocation(req.body);
      res.status(201).json(location);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getAllLocations(req, res) {
    try {
      const locations = await locationService.getAllLocations();
      res.status(200).json(locations);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getLocationById(req, res) {
    try {
      const location = await locationService.getLocationById(req.params.id);
      res.status(200).json(location);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getLocationByUserId(req, res) {
    try {
      const locations = await locationService.getLocationByUserId(req.params.userId);
      res.status(200).json(locations);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async updateLocation(req, res) {
    try {
      const location = await locationService.updateLocation(req.params.id, req.body);
      res.status(200).json(location);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async deleteLocation(req, res) {
    try {
      await locationService.deleteLocation(req.params.id);
      res.status(200).json({ message: 'Location berhasil dihapus.' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = LocationController;
