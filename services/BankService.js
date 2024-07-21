const { sequelize, Bank, User } = require('../models');

class BankService {
  async createBank(bankData) {
    const t = await sequelize.transaction();
    try {
      const bank = await Bank.create({
        user_id: bankData.user_id,
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

  async getAllBanks() {
    try {
      const banks = await Bank.findAll({
        where: { active: true },
        include: [{ model: User, as: 'user' }]
      });
      return banks;
    } catch (error) {
      console.error('Failed to fetch banks:', error);
      throw error;
    }
  }

  async getBankById(id) {
    try {
      const bank = await Bank.findByPk(id, {
        include: [{ model: User, as: 'user' }]
      });
      if (!bank) {
        throw new Error('Bank tidak ditemukan');
      }
      return bank;
    } catch (error) {
      console.error('Failed to fetch bank:', error);
      throw error;
    }
  }

  async getBanksByUserId(userId) {
    try {
      const banks = await Bank.findAll({
        where: { user_id: userId, active: true },
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

  async updateBank(id, updateData) {
    const t = await sequelize.transaction();
    try {
      const bank = await Bank.findOne({ where: { id }, transaction: t });
      if (!bank) {
        throw new Error('Bank tidak ditemukan');
      }

      await Bank.update(updateData, {
        where: { id },
        transaction: t
      });

      await t.commit();
      return await Bank.findByPk(id, {
        include: [{ model: User, as: 'user' }]
      });
    } catch (error) {
      await t.rollback();
      console.error('Failed to update bank:', error);
      throw error;
    }
  }

  async deleteBank(id) {
    try {
      const bank = await Bank.findByPk(id);
      if (!bank) {
        throw new Error('Bank tidak ditemukan');
      }

      await Bank.update({ active: false }, { where: { id } });
      return { message: 'Bank berhasil dihapus.' };
    } catch (error) {
      console.error('Failed to delete bank:', error);
      throw error;
    }
  }
}

module.exports = BankService;
