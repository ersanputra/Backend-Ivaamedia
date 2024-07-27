const { sequelize, Location, User, Business, UserBusiness } = require('../models');

class LocationService {
  async createLocation(userId, locationData) {
    const t = await sequelize.transaction();
    try {
      const location = await Location.create({
        name: locationData.name,
        active: locationData.active || true,
        user_id: userId
      }, { transaction: t });

      await t.commit();
      return location;
    } catch (error) {
      await t.rollback();
      console.error('Failed to create location:', error);
      throw error;
    }
  }

  async getAllLocations(userId) {
    try {
      const locations = await Location.findAll({
        where: { user_id: userId, active: true },
        include: [{ model: User, as: 'user' }]
      });
      return locations;
    } catch (error) {
      console.error('Failed to fetch locations:', error);
      throw error;
    }
  }

  async getLocationById(userId, id) {
    try {
      const location = await Location.findOne({
        where: { id, user_id: userId },
        include: [{ model: User, as: 'user' }]
      });
      if (!location) {
        throw new Error('Location tidak ditemukan atau Anda tidak memiliki akses ke lokasi ini');
      }
      return location;
    } catch (error) {
      console.error('Failed to fetch location:', error);
      throw error;
    }
  }

  async  getLocationByUserId(userId) {
    try {
      // Check if the user exists in UserBusiness
      const userBusiness = await UserBusiness.findOne({
        where: { user_id: userId }
      });
  
      if (!userBusiness) {
        throw new Error('User not found in UserBusiness');
      }
  
      const businessId = userBusiness.business_id;
  
      // Fetch all user_ids that belong to the same business_id
      const userBusinesses = await UserBusiness.findAll({
        where: { business_id: businessId },
        attributes: ['user_id']
      });
  
      const userIds = userBusinesses.map(ub => ub.user_id);
  
      // Fetch locations for the user within the same business
      const locations = await Location.findAll({
        where: {
          user_id: userIds,
          active: true
        },
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
  

  async  updateLocation(userId, id, updateData) {
    const t = await sequelize.transaction();
    try {
      // Check if the user exists in UserBusiness
      const userBusiness = await UserBusiness.findOne({
        where: { user_id: userId }
      });
  
      if (!userBusiness) {
        throw new Error('User not found in UserBusiness');
      }
  
      const businessId = userBusiness.business_id;
  
      // Fetch all user_ids that belong to the same business_id
      const userBusinesses = await UserBusiness.findAll({
        where: { business_id: businessId },
        attributes: ['user_id']
      });
  
      const userIds = userBusinesses.map(ub => ub.user_id);
  
      // Fetch the location to be updated
      const location = await Location.findOne({
        where: { id, user_id: userIds },
        transaction: t
      });
  
      if (!location) {
        throw new Error('Location tidak ditemukan atau Anda tidak memiliki akses ke lokasi ini');
      }
  
      await location.update(updateData, { transaction: t });
  
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
  

  async  deleteLocation(userId, id) {
    const t = await sequelize.transaction();
    try {
      // Check if the user exists in UserBusiness
      const userBusiness = await UserBusiness.findOne({
        where: { user_id: userId }
      });
  
      if (!userBusiness) {
        throw new Error('User not found in UserBusiness');
      }
  
      const businessId = userBusiness.business_id;
  
      // Fetch all user_ids that belong to the same business_id
      const userBusinesses = await UserBusiness.findAll({
        where: { business_id: businessId },
        attributes: ['user_id']
      });
  
      const userIds = userBusinesses.map(ub => ub.user_id);
  
      // Fetch the location to be deleted
      const location = await Location.findOne({
        where: { id, user_id: userIds },
        transaction: t
      });
  
      if (!location) {
        throw new Error('Location tidak ditemukan atau Anda tidak memiliki akses ke lokasi ini');
      }
  
      await location.update({ active: false }, { transaction: t });
  
      await t.commit();
      return { message: 'Location berhasil dihapus.' };
    } catch (error) {
      await t.rollback();
      console.error('Failed to delete location:', error);
      throw error;
    }
  }
  
}

module.exports = LocationService;
