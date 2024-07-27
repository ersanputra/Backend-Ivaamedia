const { sequelize, UserBusiness, User, Business } = require('../models');

class UserBusinessService {
  async createUserBusiness(userBusinessData) {
    const t = await sequelize.transaction();
    try {
      const userBusiness = await UserBusiness.create({
        user_id: userBusinessData.user_id,
        business_id: userBusinessData.business_id,
      }, { transaction: t });

      await t.commit();
      return userBusiness;
    } catch (error) {
      await t.rollback();
      console.error('Failed to create user business:', error);
      throw error;
    }
  }

  async getAllUserBusinesses() {
    try {
      const userBusinesses = await UserBusiness.findAll({
        include: [
          { model: User, as: 'user' },
          { model: Business, as: 'business' }
        ]
      });
      return userBusinesses;
    } catch (error) {
      console.error('Failed to fetch user businesses:', error);
      throw error;
    }
  }

  async getUserBusinessById(id) {
    try {
      const userBusiness = await UserBusiness.findByPk(id, {
        include: [
          { model: User, as: 'user' },
          { model: Business, as: 'business' }
        ]
      });
      if (!userBusiness) {
        throw new Error('User business not found');
      }
      return userBusiness;
    } catch (error) {
      console.error('Failed to fetch user business:', error);
      throw error;
    }
  }

  async getUserBusinessesByUserId(userId) {
    try {
      const userBusinesses = await UserBusiness.findAll({
        where: { user_id: userId },
        include: [
          { model: User, as: 'user' },
          { model: Business, as: 'business' }
        ]
      });
      if (!userBusinesses.length) {
        throw new Error('User businesses not found');
      }
      return userBusinesses;
    } catch (error) {
      console.error('Failed to fetch user businesses by user id:', error);
      throw error;
    }
  }

  async updateUserBusiness(id, updateData) {
    const t = await sequelize.transaction();
    try {
      const userBusiness = await UserBusiness.findOne({ where: { id }, transaction: t });
      if (!userBusiness) {
        throw new Error('User business not found');
      }

      await UserBusiness.update(updateData, {
        where: { id },
        transaction: t
      });

      await t.commit();
      return await UserBusiness.findByPk(id, {
        include: [
          { model: User, as: 'user' },
          { model: Business, as: 'business' }
        ]
      });
    } catch (error) {
      await t.rollback();
      console.error('Failed to update user business:', error);
      throw error;
    }
  }

  async deleteUserBusiness(id) {
    try {
      const userBusiness = await UserBusiness.findByPk(id);
      if (!userBusiness) {
        throw new Error('User business not found');
      }

      await UserBusiness.destroy({ where: { id } });
      return { message: 'User business successfully deleted.' };
    } catch (error) {
      console.error('Failed to delete user business:', error);
      throw error;
    }
  }
}

module.exports = UserBusinessService;
