const { sequelize, Inventory, ProductCategory, Location, User, Business, UserBusiness } = require('../models');

class InventoryService {
  async createInventory(userId, inventoryData) {
    const t = await sequelize.transaction();
    try {
        const existingInventory = await Inventory.findOne({
            where: {
                sku: inventoryData.sku,
                user_id: userId,
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
                user_id: userId,
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

  async getAllInventories(userId) {
    try {
      const inventories = await Inventory.findAll({
        where: { user_id: userId, active: true },
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

  async  getInventoryById(userId, id) {
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
  
      // Fetch the inventory if it belongs to the same business
      const inventory = await Inventory.findOne({
        where: { id, user_id: userIds },
        include: [
          { model: ProductCategory, as: 'productCategory' },
          { model: Location, as: 'location' },
          { model: User, as: 'user' }
        ]
      });
  
      if (!inventory) {
        throw new Error('Inventory tidak ditemukan atau Anda tidak memiliki akses ke inventori ini');
      }
  
      return inventory;
    } catch (error) {
      console.error('Failed to fetch inventory:', error);
      throw error;
    }
  }
  

  async  getInventoriesByUserId(userId) {
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
  
      // Fetch inventories for the user within the same business
      const inventories = await Inventory.findAll({
        where: {
          user_id: userIds,
          active: true
        },
        include: [
          { model: ProductCategory, as: 'productCategory' },
          { model: Location, as: 'location' },
          { model: User, as: 'user' }
        ]
      });
  
      if (!inventories.length) {
        throw new Error('Inventories tidak ditemukan');
      }
  
      return inventories;
    } catch (error) {
      console.error('Failed to fetch inventories by user id:', error);
      throw error;
    }
  }
  

  async  updateInventory(userId, id, updateData) {
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
  
      // Fetch the inventory if it belongs to the same business
      const inventory = await Inventory.findOne({
        where: { id, user_id: userIds },
        transaction: t
      });
  
      if (!inventory) {
        throw new Error('Inventory tidak ditemukan atau Anda tidak memiliki akses ke inventori ini');
      }
  
      await inventory.update(updateData, { transaction: t });
  
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
  

  async  deleteInventory(userId, id) {
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
  
      // Fetch the inventory if it belongs to the same business
      const inventory = await Inventory.findOne({
        where: { id, user_id: userIds },
        transaction: t
      });
  
      if (!inventory) {
        throw new Error('Inventory tidak ditemukan atau Anda tidak memiliki akses ke inventori ini');
      }
  
      await inventory.update({ active: false }, { transaction: t });
  
      await t.commit();
      return { message: 'Inventory berhasil dihapus.' };
    } catch (error) {
      await t.rollback();
      console.error('Failed to delete inventory:', error);
      throw error;
    }
  }
  
}

module.exports = InventoryService;
