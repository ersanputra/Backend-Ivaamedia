const { sequelize, Location, User } = require('../models');

class LocationService {
  async createLocation(locationData) {
    const t = await sequelize.transaction();
    try {
      const location = await Location.create({
        name: locationData.name,
        active: locationData.active || true,
        user_id: locationData.user_id
      }, { transaction: t });

      await t.commit();
      return location;
    } catch (error) {
      await t.rollback();
      console.error('Failed to create location:', error);
      throw error;
    }
  }

  async getAllLocations() {
    try {
      const locations = await Location.findAll({
        where: { active: true },
        include: [{ model: User, as: 'user' }]
      });
      return locations;
    } catch (error) {
      console.error('Failed to fetch locations:', error);
      throw error;
    }
  }

  async getLocationById(id) {
    try {
      const location = await Location.findByPk(id, {
        include: [{ model: User, as: 'user' }]
      });
      if (!location) {
        throw new Error('Location tidak ditemukan');
      }
      return location;
    } catch (error) {
      console.error('Failed to fetch location:', error);
      throw error;
    }
  }

  async getLocationByUserId(userId) {
    try {
      const locations = await Location.findAll({
        where: { user_id: userId, active: true },
        include: [{ model: User, as: 'user' }]
      });
      if (!locations.length) {
        throw new Error('Locations tidak ditemukan');
      }
      return locations;
    } catch (error) {
      console.error('Failed to fetch locations by user id:', error);
      throw error;
    }
  }

  async updateLocation(id, updateData) {
    const t = await sequelize.transaction();
    try {
      const location = await Location.findOne({ where: { id }, transaction: t });
      if (!location) {
        throw new Error('Location tidak ditemukan');
      }

      await Location.update(updateData, {
        where: { id },
        transaction: t
      });

      await t.commit();
      return await Location.findOne({
        where: { id },
        include: [{ model: User, as: 'user' }]
      });
    } catch (error) {
      await t.rollback();
      console.error('Failed to update location:', error);
      throw error;
    }
  }

  async deleteLocation(id) {
    try {
      const location = await Location.findByPk(id);
      if (!location) {
        throw new Error('Location tidak ditemukan');
      }

      await Location.update({ active: false }, { where: { id } });
      return { message: 'Location berhasil dihapus.' };
    } catch (error) {
      console.error('Failed to delete location:', error);
      throw error;
    }
  }
}

module.exports = LocationService;
