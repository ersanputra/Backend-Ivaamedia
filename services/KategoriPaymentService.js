const { sequelize, KategoriPayment, User,UserBusiness } = require('../models');

class KategoriPaymentService {
  async createKategoriPayment(userId, kategoriPaymentData) {
    const t = await sequelize.transaction();
    try {
      const kategoriPayment = await KategoriPayment.create({
        tipe: kategoriPaymentData.tipe,
        nama: kategoriPaymentData.nama,
        active: kategoriPaymentData.active || true,
        user_id: userId
      }, { transaction: t });

      await t.commit();
      return kategoriPayment;
    } catch (error) {
      await t.rollback();
      console.error('Failed to create kategori payment:', error);
      throw error;
    }
  }

  async getAllKategoriPayments(userId) {
    try {
      const kategoriPayments = await KategoriPayment.findAll({
        where: { user_id: userId, active: true },
        include: [{ model: User, as: 'user' }]
      });
      return kategoriPayments;
    } catch (error) {
      console.error('Failed to fetch kategori payments:', error);
      throw error;
    }
  }

  async getKategoriPaymentById(userId, id) {
    try {
      const kategoriPayment = await KategoriPayment.findOne({
        where: { id, user_id: userId },
        include: [{ model: User, as: 'user' }]
      });
      if (!kategoriPayment) {
        throw new Error('Kategori Payment tidak ditemukan atau Anda tidak memiliki akses ke kategori ini');
      }
      return kategoriPayment;
    } catch (error) {
      console.error('Failed to fetch kategori payment:', error);
      throw error;
    }
  }

  async getKategoriPaymentByUserId(requestingUserId, userId) {
    try {
      // Check if the requesting user exists in UserBusiness
      const requestingUserBusiness = await UserBusiness.findOne({
        where: { user_id: requestingUserId }
      });

      if (!requestingUserBusiness) {
        throw new Error('Requesting user not found in UserBusiness');
      }

      const businessId = requestingUserBusiness.business_id;

      // Fetch all user_ids that belong to the same business_id
      const userBusinesses = await UserBusiness.findAll({
        where: { business_id: businessId },
        attributes: ['user_id']
      });

      const userIds = userBusinesses.map(ub => ub.user_id);

      // Fetch kategori payments for all users in the same business
      const kategoriPayments = await KategoriPayment.findAll({
        where: {
          user_id: userIds,
          active: true
        },
        include: [{ model: User, as: 'user' }]
      });

      if (!kategoriPayments.length) {
        throw new Error('Kategori Payments tidak ditemukan');
      }

      return kategoriPayments;
    } catch (error) {
      console.error('Failed to fetch kategori payments by user id:', error);
      throw error;
    }
  }

  async updateKategoriPayment(requestingUserId, id, updateData) {
    const t = await sequelize.transaction();
    try {
      // Check if the requesting user exists in UserBusiness
      const requestingUserBusiness = await UserBusiness.findOne({
        where: { user_id: requestingUserId }
      });

      if (!requestingUserBusiness) {
        throw new Error('Requesting user not found in UserBusiness');
      }

      const businessId = requestingUserBusiness.business_id;

      // Fetch all user_ids that belong to the same business_id
      const userBusinesses = await UserBusiness.findAll({
        where: { business_id: businessId },
        attributes: ['user_id']
      });

      const userIds = userBusinesses.map(ub => ub.user_id);

      // Fetch the kategori payment if it belongs to the same business
      const kategoriPayment = await KategoriPayment.findOne({
        where: { id, user_id: userIds },
        transaction: t
      });

      if (!kategoriPayment) {
        throw new Error('Kategori Payment tidak ditemukan atau Anda tidak memiliki akses ke kategori ini');
      }

      await kategoriPayment.update(updateData, { transaction: t });

      await t.commit();
      return await KategoriPayment.findOne({
        where: { id },
        include: [{ model: User, as: 'user' }]
      });
    } catch (error) {
      await t.rollback();
      console.error('Failed to update kategori payment:', error);
      throw error;
    }
  }

  async deleteKategoriPayment(requestingUserId, id) {
    const t = await sequelize.transaction();
    try {
      // Check if the requesting user exists in UserBusiness
      const requestingUserBusiness = await UserBusiness.findOne({
        where: { user_id: requestingUserId }
      });

      if (!requestingUserBusiness) {
        throw new Error('Requesting user not found in UserBusiness');
      }

      const businessId = requestingUserBusiness.business_id;

      // Fetch all user_ids that belong to the same business_id
      const userBusinesses = await UserBusiness.findAll({
        where: { business_id: businessId },
        attributes: ['user_id']
      });

      const userIds = userBusinesses.map(ub => ub.user_id);

      // Fetch the kategori payment if it belongs to the same business
      const kategoriPayment = await KategoriPayment.findOne({
        where: { id, user_id: userIds },
        transaction: t
      });

      if (!kategoriPayment) {
        throw new Error('Kategori Payment tidak ditemukan atau Anda tidak memiliki akses ke kategori ini');
      }

      await kategoriPayment.update({ active: false }, { transaction: t });

      await t.commit();
      return { message: 'Kategori Payment berhasil dihapus.' };
    } catch (error) {
      await t.rollback();
      console.error('Failed to delete kategori payment:', error);
      throw error;
    }
  }

}

module.exports = KategoriPaymentService;
