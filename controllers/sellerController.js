const SellerService = require('../services/sellerService');
const sellerService = new SellerService();

class SellerController {
  static async createSeller(req, res) {
    try {
      const seller = await sellerService.createSeller(req.user.id, req.body);
      res.status(201).json(seller);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getAllSellers(req, res) {
    try {
      const sellers = await sellerService.getAllSellers(req.user.id);
      res.status(200).json(sellers);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getSellerById(req, res) {
    try {
      const seller = await sellerService.getSellerById(req.user.id, req.params.id);
      res.status(200).json(seller);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getSellersByUserId(req, res) {
    try {
      const sellers = await sellerService.getSellersByUserId(req.params.userId);
      res.status(200).json(sellers);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async updateSeller(req, res) {
    try {
      const seller = await sellerService.updateSeller(req.user.id, req.params.id, req.body);
      res.status(200).json(seller);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async deleteSeller(req, res) {
    try {
      await sellerService.deleteSeller(req.user.id, req.params.id);
      res.status(200).json({ message: 'Seller successfully deleted.' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = SellerController;
