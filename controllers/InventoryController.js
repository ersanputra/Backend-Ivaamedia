const InventoryService = require('../services/InventoryService');
const inventoryService = new InventoryService();

class InventoryController {
  static async createInventory(req, res) {
    try {
      const inventory = await inventoryService.createInventory(req.user.id, req.body);
      res.status(201).json(inventory);
    } catch (error) {
      if (error.message === 'SKU already exists. Please use a different SKU.') {
        res.status(400).json({ error: 'SKU already exists. Please use a different SKU.' });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  }

  static async getAllInventories(req, res) {
    try {
      const inventories = await inventoryService.getAllInventories(req.user.id);
      res.status(200).json(inventories);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getInventoryById(req, res) {
    try {
      const inventory = await inventoryService.getInventoryById(req.user.id, req.params.id);
      res.status(200).json(inventory);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getInventoriesByUserId(req, res) {
    try {
      if (req.user.id !== parseInt(req.params.userId, 10)) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      const inventories = await inventoryService.getInventoriesByUserId(req.params.userId);
      res.status(200).json(inventories);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async updateInventory(req, res) {
    try {
      const inventory = await inventoryService.updateInventory(req.user.id, req.params.id, req.body);
      res.status(200).json(inventory);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async deleteInventory(req, res) {
    try {
      await inventoryService.deleteInventory(req.user.id, req.params.id);
      res.status(200).json({ message: 'Inventory berhasil dihapus.' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = InventoryController;
