const { sequelize, Seller, User, UserBusiness  } = require('../models');

class SellerService {
  async createSeller(userId, sellerData) {
    const t = await sequelize.transaction();
    try {
      const seller = await Seller.create({
        user_id: userId,
        seller: sellerData.seller,
        active: sellerData.active || true,
      }, { transaction: t });

      await t.commit();
      return seller;
    } catch (error) {
      await t.rollback();
      console.error('Failed to create seller:', error);
      throw error;
    }
  }

  async getAllSellers(userId) {
    try {
      const sellers = await Seller.findAll({
        where: { user_id: userId, active: true },
        include: [{ model: User, as: 'user' }]
      });
      return sellers;
    } catch (error) {
      console.error('Failed to fetch sellers:', error);
      throw error;
    }
  }

  async getSellerById(userId, id) {
    try {
      const seller = await Seller.findOne({
        where: { id, user_id: userId },
        include: [{ model: User, as: 'user' }]
      });
      if (!seller) {
        throw new Error('Seller tidak ditemukan atau Anda tidak memiliki akses ke seller ini');
      }
      return seller;
    } catch (error) {
      console.error('Failed to fetch seller:', error);
      throw error;
    }
  }

  async getSellersByUserId(userId) {
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

        const sellers = await Seller.findAll({
            where: { user_id: userIds, active: true },
            include: [{ model: User, as: 'user' }]
        });
        
        return sellers;
    } catch (error) {
        console.error('Failed to fetch sellers by user ID:', error);
        throw error;
    }
}


  async updateSeller(userId, id, updateData) {
    const t = await sequelize.transaction();
    try {
      const seller = await Seller.findOne({
        where: { id, user_id: userId },
        transaction: t
      });
      if (!seller) {
        throw new Error('Seller tidak ditemukan atau Anda tidak memiliki akses ke seller ini');
      }

      await seller.update(updateData, { transaction: t });

      await t.commit();
      return await Seller.findOne({
        where: { id },
        include: [{ model: User, as: 'user' }]
      });
    } catch (error) {
      await t.rollback();
      console.error('Failed to update seller:', error);
      throw error;
    }
  }

  async deleteSeller(userId, id) {
    const t = await sequelize.transaction();
    try {
      const seller = await Seller.findOne({
        where: { id, user_id: userId },
        transaction: t
      });
      if (!seller) {
        throw new Error('Seller tidak ditemukan atau Anda tidak memiliki akses ke seller ini');
      }

      await seller.update({ active: false }, { transaction: t });

      await t.commit();
      return { message: 'Seller berhasil dihapus.' };
    } catch (error) {
      await t.rollback();
      console.error('Failed to delete seller:', error);
      throw error;
    }
  }
}

module.exports = SellerService;
