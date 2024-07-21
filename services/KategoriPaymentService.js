const { sequelize, KategoriPayment, User } = require('../models');

class KategoriPaymentService {
  async createKategoriPayment(kategoriPaymentData) {
    const t = await sequelize.transaction();
    try {
      const kategoriPayment = await KategoriPayment.create({
        tipe: kategoriPaymentData.tipe,
        nama: kategoriPaymentData.nama,
        active: kategoriPaymentData.active || true,
        user_id: kategoriPaymentData.user_id
      }, { transaction: t });

      await t.commit();
      return kategoriPayment;
    } catch (error) {
      await t.rollback();
      console.error('Failed to create kategori payment:', error);
      throw error;
    }
  }

  async getAllKategoriPayments() {
    try {
      const kategoriPayments = await KategoriPayment.findAll({
        where: { active: true },
        include: [{ model: User, as: 'user' }]
      });
      return kategoriPayments;
    } catch (error) {
      console.error('Failed to fetch kategori payments:', error);
      throw error;
    }
  }

  async getKategoriPaymentById(id) {
    try {
      const kategoriPayment = await KategoriPayment.findByPk(id, {
        include: [{ model: User, as: 'user' }]
      });
      if (!kategoriPayment) {
        throw new Error('Kategori Payment tidak ditemukan');
      }
      return kategoriPayment;
    } catch (error) {
      console.error('Failed to fetch kategori payment:', error);
      throw error;
    }
  }

  async getKategoriPaymentByUserId(userId) {
    try {
      const kategoriPayments = await KategoriPayment.findAll({
        where: { user_id: userId, active: true },
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

  async updateKategoriPayment(id, updateData) {
    const t = await sequelize.transaction();
    try {
      const kategoriPayment = await KategoriPayment.findOne({ where: { id }, transaction: t });
      if (!kategoriPayment) {
        throw new Error('Kategori Payment tidak ditemukan');
      }

      await KategoriPayment.update(updateData, {
        where: { id },
        transaction: t
      });

      await t.commit();
      return await KategoriPayment.findByPk(id, {
        include: [{ model: User, as: 'user' }]
      });
    } catch (error) {
      await t.rollback();
      console.error('Failed to update kategori payment:', error);
      throw error;
    }
  }

  async deleteKategoriPayment(id) {
    try {
      const kategoriPayment = await KategoriPayment.findByPk(id);
      if (!kategoriPayment) {
        throw new Error('Kategori Payment tidak ditemukan');
      }

      await KategoriPayment.update({ active: false }, { where: { id } });
      return { message: 'Kategori Payment berhasil dihapus.' };
    } catch (error) {
      console.error('Failed to delete kategori payment:', error);
      throw error;
    }
  }
}

module.exports = KategoriPaymentService;
