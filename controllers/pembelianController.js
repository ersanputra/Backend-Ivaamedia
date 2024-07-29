const PembelianService = require('../services/pembelianService');
const pembelianService = new PembelianService();

class PembelianController {
  static async createPembelian(req, res) {
    try {
      const pembelian = await pembelianService.createPembelian(req.user.id, req.body);
      res.status(201).json(pembelian);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getAllPembelians(req, res) {
    try {
      const pembelians = await pembelianService.getAllPembelians(req.user.id);
      res.status(200).json(pembelians);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getPembelianById(req, res) {
    try {
      const pembelian = await pembelianService.getPembelianById(req.user.id, req.params.id);
      res.status(200).json(pembelian);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async updatePembelian(req, res) {
    try {
      const pembelian = await pembelianService.updatePembelian(req.user.id, req.params.id, req.body);
      res.status(200).json(pembelian);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async deletePembelian(req, res) {
    try {
      await pembelianService.deletePembelian(req.user.id, req.params.id);
      res.status(200).json({ message: 'Pembelian berhasil dihapus.' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = PembelianController;
