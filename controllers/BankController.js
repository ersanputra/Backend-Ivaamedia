const BankService = require('../services/BankService');
const bankService = new BankService();

class BankController {
  static async createBank(req, res) {
    try {
      const bank = await bankService.createBank(req.body);
      res.status(201).json(bank);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getAllBanks(req, res) {
    try {
      const banks = await bankService.getAllBanks();
      res.status(200).json(banks);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getBankById(req, res) {
    try {
      const bank = await bankService.getBankById(req.params.id);
      res.status(200).json(bank);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getBanksByUserId(req, res) {
    try {
      const banks = await bankService.getBanksByUserId(req.params.userId);
      res.status(200).json(banks);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async updateBank(req, res) {
    try {
      const bank = await bankService.updateBank(req.params.id, req.body);
      res.status(200).json(bank);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async deleteBank(req, res) {
    try {
      await bankService.deleteBank(req.params.id);
      res.status(200).json({ message: 'Bank berhasil dihapus.' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = BankController;
