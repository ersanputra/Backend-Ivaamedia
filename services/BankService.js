const { sequelize, Bank, User, UserBusiness } = require('../models');

class BankService {
  async createBank(userId, bankData) {
    const t = await sequelize.transaction();
    try {
      const bank = await Bank.create({
        user_id: userId,
        nama_bank: bankData.nama_bank,
        nomor_rekening: bankData.nomor_rekening,
        pemilik_rekening: bankData.pemilik_rekening,
        saldo: bankData.saldo || 0.00,
        active: bankData.active || true
      }, { transaction: t });

      await t.commit();
      return bank;
    } catch (error) {
      await t.rollback();
      console.error('Failed to create bank:', error);
      throw error;
    }
  }

  async getAllBanks(userId) {
    try {
      const banks = await Bank.findAll({
        where: { user_id: userId, active: true },
        include: [{ model: User, as: 'user' }]
      });
      return banks;
    } catch (error) {
      console.error('Failed to fetch banks:', error);
      throw error;
    }
  }

  async getBankById(userId, id) {
    try {
      const bank = await Bank.findOne({
        where: { id, user_id: userId },
        include: [{ model: User, as: 'user' }]
      });
      if (!bank) {
        throw new Error('Bank tidak ditemukan atau Anda tidak memiliki akses ke bank ini');
      }
      return bank;
    } catch (error) {
      console.error('Failed to fetch bank:', error);
      throw error;
    }
  }

  async getBanksByUserId(userId) {
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

      // Fetch banks for all users in the same business
      const banks = await Bank.findAll({
        where: { user_id: userIds, active: true },
        include: [{ model: User, as: 'user' }]
      });

      if (!banks.length) {
        throw new Error('Banks tidak ditemukan');
      }
      return banks;
    } catch (error) {
      console.error('Failed to fetch banks by user id:', error);
      throw error;
    }
  }

  async updateBank(userId, id, updateData) {
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

      const bank = await Bank.findOne({
        where: { id, user_id: userIds },
        transaction: t
      });
      if (!bank) {
        throw new Error('Bank tidak ditemukan atau Anda tidak memiliki akses ke bank ini');
      }

      await bank.update(updateData, { transaction: t });

      await t.commit();
      return await Bank.findOne({
        where: { id },
        include: [{ model: User, as: 'user' }]
      });
    } catch (error) {
      await t.rollback();
      console.error('Failed to update bank:', error);
      throw error;
    }
  }

  async deleteBank(userId, id) {
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

      const bank = await Bank.findOne({
        where: { id, user_id: userIds },
        transaction: t
      });
      if (!bank) {
        throw new Error('Bank tidak ditemukan atau Anda tidak memiliki akses ke bank ini');
      }

      await bank.update({ active: false }, { transaction: t });

      await t.commit();
      return { message: 'Bank berhasil dihapus.' };
    } catch (error) {
      await t.rollback();
      console.error('Failed to delete bank:', error);
      throw error;
    }
  }
}

module.exports = BankService;
