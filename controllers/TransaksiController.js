const TransaksiService = require('../services/TransaksiService');
const transaksiService = new TransaksiService();

class TransaksiController {
  static async createTransaksi(req, res) {
    try {
      const result = await transaksiService.createTransaksi(req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getAllTransaksi(req, res) {
    try {
      const transaksis = await transaksiService.getAllTransaksi();
      res.status(200).json(transaksis);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getTransaksiById(req, res) {
    try {
      const transaksi = await transaksiService.getTransaksiById(req.params.id);
      res.status(200).json(transaksi);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getTransaksiByUserId(req, res) {
    try {
      const transaksis = await transaksiService.getTransaksiByUserId(req.params.userId);
      res.status(200).json(transaksis);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async updateTransaksi(req, res) {
    try {
      const transaksi = await transaksiService.updateTransaksi(req.params.id, req.body);
      res.status(200).json(transaksi);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async deleteTransaksi(req, res) {
    try {
      await transaksiService.deleteTransaksi(req.params.id);
      res.status(200).json({ message: 'Transaksi berhasil dihapus.' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = TransaksiController;
