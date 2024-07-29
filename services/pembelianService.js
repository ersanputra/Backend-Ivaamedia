const { sequelize, Pembelian, PembelianDetail, Seller, User, ProductCategory, Inventory } = require('../models');

class PembelianService {
  async createPembelian(userId, pembelianData) {
    const t = await sequelize.transaction();
    try {
        let productCategoryId = null;

      if (pembelianData.details && pembelianData.details.length > 0) {
        // Ambil inventori_id dari detail pertama
        const firstDetail = pembelianData.details[0];
        const inventory = await Inventory.findOne({
          where: { id: firstDetail.inventori_id },
          transaction: t
        });
        if (!inventory) {
          throw new Error(`Inventory with id ${firstDetail.inventori_id} not found`);
        }
        // Ambil product_category_id dari inventory pertama
        productCategoryId = inventory.product_category_id;
      }
      const pembelian = await Pembelian.create({
        user_id: userId,
        tanggal: pembelianData.tanggal,
        seller_id: pembelianData.seller_id,
        product_category_id: productCategoryId,
        metode_pembelian: pembelianData.metode_pembelian,
        pembayaran: pembelianData.pembayaran,
        ongkir: pembelianData.ongkir,
        diskon: pembelianData.diskon,
        total: pembelianData.total,
        bukti_pembayaran: pembelianData.bukti_pembayaran,
        bukti_pembelian: pembelianData.bukti_pembelian,
        harga_total: pembelianData.harga_total,
        status_pesanan: pembelianData.status_pesanan,
        catatan: pembelianData.catatan,
        active: pembelianData.active || true
      }, { transaction: t });

      // Insert PembelianDetails if any
      if (pembelianData.details && pembelianData.details.length > 0) {
        for (const detail of pembelianData.details) {
          // Check Inventory for inventori_id and get the name
          const inventory = await Inventory.findOne({
            where: { id: detail.inventori_id },
            transaction: t
          });
          if (!inventory) {
            throw new Error(`Inventory with id ${detail.inventori_id} not found`);
          }

          await PembelianDetail.create({
            pembelian_id: pembelian.id,
            inventori_id: detail.inventori_id,
            harga: detail.harga,
            satuan: detail.satuan,
            nama: inventory.name // Use the name from Inventory
          }, { transaction: t });
        }
      }

      await t.commit();
      return pembelian;
    } catch (error) {
      await t.rollback();
      console.error('Failed to create pembelian:', error);
      throw error;
    }
  }

  async getAllPembelians(userId) {
    try {
      const pembelians = await Pembelian.findAll({
        where: { user_id: userId, active: true },
        include: [
          { model: User, as: 'user' },
          { model: Seller, as: 'seller' },
          { model: ProductCategory, as: 'productCategory' },
          { model: PembelianDetail, as: 'details' }
        ]
      });
      return pembelians;
    } catch (error) {
      console.error('Failed to fetch pembelians:', error);
      throw error;
    }
  }

  async getPembelianById(userId, id) {
    try {
      const pembelian = await Pembelian.findOne({
        where: { id, user_id: userId },
        include: [
          { model: User, as: 'user' },
          { model: Seller, as: 'seller' },
          { model: ProductCategory, as: 'productCategory' },
          { model: PembelianDetail, as: 'details' }
        ]
      });
      if (!pembelian) {
        throw new Error('Pembelian tidak ditemukan atau Anda tidak memiliki akses ke pembelian ini');
      }
      return pembelian;
    } catch (error) {
      console.error('Failed to fetch pembelian:', error);
      throw error;
    }
  }

  async updatePembelian(userId, id, updateData) {
    const t = await sequelize.transaction();
    try {
      const pembelian = await Pembelian.findOne({
        where: { id, user_id: userId },
        transaction: t
      });
      if (!pembelian) {
        throw new Error('Pembelian tidak ditemukan atau Anda tidak memiliki akses ke pembelian ini');
      }

      await pembelian.update(updateData, { transaction: t });

      if (updateData.details && updateData.details.length > 0) {
        for (const detail of updateData.details) {
          const pembelianDetail = await PembelianDetail.findOne({
            where: { id: detail.id, pembelian_id: id },
            transaction: t
          });
          if (pembelianDetail) {
            await pembelianDetail.update(detail, { transaction: t });
          } else {
            const inventory = await Inventory.findOne({
              where: { id: detail.inventori_id },
              transaction: t
            });
            if (!inventory) {
              throw new Error(`Inventory with id ${detail.inventori_id} not found`);
            }

            await PembelianDetail.create({
              pembelian_id: id,
              inventori_id: detail.inventori_id,
              harga: detail.harga,
              satuan: detail.satuan,
              nama: inventory.name // Use the name from Inventory
            }, { transaction: t });
          }
        }
      }

      await t.commit();
      return await Pembelian.findOne({
        where: { id },
        include: [
          { model: User, as: 'user' },
          { model: Seller, as: 'seller' },
          { model: ProductCategory, as: 'productCategory' },
          { model: PembelianDetail, as: 'details' }
        ]
      });
    } catch (error) {
      await t.rollback();
      console.error('Failed to update pembelian:', error);
      throw error;
    }
  }

  async deletePembelian(userId, id) {
    const t = await sequelize.transaction();
    try {
      const pembelian = await Pembelian.findOne({
        where: { id, user_id: userId },
        transaction: t
      });
      if (!pembelian) {
        throw new Error('Pembelian tidak ditemukan atau Anda tidak memiliki akses ke pembelian ini');
      }

      await pembelian.update({ active: false }, { transaction: t });

      await t.commit();
      return { message: 'Pembelian berhasil dihapus.' };
    } catch (error) {
      await t.rollback();
      console.error('Failed to delete pembelian:', error);
      throw error;
    }
  }
}

module.exports = PembelianService;
