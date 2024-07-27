const LocationService = require('../services/LocationService');
const locationService = new LocationService();

class LocationController {
  static async createLocation(req, res) {
    try {
      const location = await locationService.createLocation(req.user.id, req.body);
      res.status(201).json(location);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getAllLocations(req, res) {
    try {
      const locations = await locationService.getAllLocations(req.user.id);
      res.status(200).json(locations);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getLocationById(req, res) {
    try {
      const location = await locationService.getLocationById(req.user.id, req.params.id);
      res.status(200).json(location);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getLocationByUserId(req, res) {
    try {
      if (req.user.id !== parseInt(req.params.userId, 10)) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      const locations = await locationService.getLocationByUserId(req.params.userId);
      res.status(200).json(locations);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async updateLocation(req, res) {
    try {
      const location = await locationService.updateLocation(req.user.id, req.params.id, req.body);
      res.status(200).json(location);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async deleteLocation(req, res) {
    try {
      await locationService.deleteLocation(req.user.id, req.params.id);
      res.status(200).json({ message: 'Location berhasil dihapus.' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = LocationController;
