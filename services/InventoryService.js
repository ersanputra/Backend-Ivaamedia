const { sequelize, Inventory, ProductCategory, Location, User } = require('../models');

class InventoryService {
  async createInventory(inventoryData) {
    const t = await sequelize.transaction();
    try {
        const existingInventory = await Inventory.findOne({
            where: {
                sku: inventoryData.sku,
                active: true
            },
            transaction: t
        });

        if (existingInventory) {
            await t.rollback();
            throw new Error('SKU already exists. Please use a different SKU.');
        } else {
            // Convert empty string selling_price to null
            const sellingPrice = inventoryData.selling_price === "" ? null : inventoryData.selling_price;

            const inventory = await Inventory.create({
                product_category_id: inventoryData.product_category_id,
                sku: inventoryData.sku,
                name: inventoryData.name,
                hpp: inventoryData.hpp,
                product_photo: inventoryData.product_photo,
                quantity: inventoryData.quantity,
                description: inventoryData.description,
                location_id: inventoryData.location_id,
                selling_price: sellingPrice,
                inventory_value: inventoryData.inventory_value,
                active: inventoryData.active || true,
                user_id: inventoryData.user_id,
                satuan: inventoryData.satuan  // Added this
            }, { transaction: t });

            await t.commit();
            return inventory;
        }
    } catch (error) {
        if (!t.finished) { // Ensure the transaction hasn't finished
            await t.rollback();
        }
        console.error('Failed to create inventory:', error);
        throw error;
    }
}


  async getAllInventories() {
    try {
      const inventories = await Inventory.findAll({
        where: { active: true },
        include: [
          { model: ProductCategory, as: 'productCategory' },
          { model: Location, as: 'location' },
          { model: User, as: 'user' }
        ]
      });

      return inventories;
    } catch (error) {
      console.error('Failed to fetch inventories:', error);
      throw error;
    }
  }

  async getInventoryById(id) {
    try {
      const inventory = await Inventory.findByPk(id, {
        include: [
          { model: ProductCategory, as: 'productCategory' },
          { model: Location, as: 'location' },
          { model: User, as: 'user' }
        ]
      });
      if (!inventory) {
        throw new Error('Inventory tidak ditemukan');
      }
      return inventory;
    } catch (error) {
      console.error('Failed to fetch inventory:', error);
      throw error;
    }
  }

  async getInventoriesByUserId(userId) {
    try {
      const locations = await Inventory.findAll({
        where: { active: true },
        include: [
          { model: ProductCategory, as: 'productCategory' },
          { model: Location, as: 'location' },
          { model: User, as: 'user' }
        ]
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

  async updateInventory(id, updateData) {
    const t = await sequelize.transaction();
    try {
      const inventory = await Inventory.findOne({ where: { id }, transaction: t });
      if (!inventory) {
        throw new Error('Inventory tidak ditemukan');
      }

      await Inventory.update(updateData, {
        where: { id },
        transaction: t
      });

      await t.commit();
      return await Inventory.findOne({
        where: { id },
        include: [
          { model: ProductCategory, as: 'productCategory' },
          { model: Location, as: 'location' },
          { model: User, as: 'user' }
        ]
      });
    } catch (error) {
      await t.rollback();
      console.error('Failed to update inventory:', error);
      throw error;
    }
  }

  async deleteInventory(id) {
    try {
      const inventory = await Inventory.findByPk(id);
      if (!inventory) {
        throw new Error('Inventory tidak ditemukan');
      }

      await Inventory.update({ active: false }, { where: { id } });
      return { message: 'Inventory berhasil dihapus.' };
    } catch (error) {
      console.error('Failed to delete inventory:', error);
      throw error;
    }
  }
}

module.exports = InventoryService;
