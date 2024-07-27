const KategoriPaymentService = require('../services/KategoriPaymentService');
const kategoriPaymentService = new KategoriPaymentService();

class KategoriPaymentController {
  static async createKategoriPayment(req, res) {
    try {
      const kategoriPayment = await kategoriPaymentService.createKategoriPayment(req.user.id, req.body);
      res.status(201).json(kategoriPayment);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getAllKategoriPayments(req, res) {
    try {
      const kategoriPayments = await kategoriPaymentService.getAllKategoriPayments(req.user.id);
      res.status(200).json(kategoriPayments);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getKategoriPaymentById(req, res) {
    try {
      const kategoriPayment = await kategoriPaymentService.getKategoriPaymentById(req.user.id, req.params.id);
      res.status(200).json(kategoriPayment);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getKategoriPaymentByUserId(req, res) {
    try {
      const kategoriPayments = await kategoriPaymentService.getKategoriPaymentByUserId(req.user.id, req.params.userId);
      res.status(200).json(kategoriPayments);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async updateKategoriPayment(req, res) {
    try {
      const kategoriPayment = await kategoriPaymentService.updateKategoriPayment(req.user.id, req.params.id, req.body);
      res.status(200).json(kategoriPayment);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async deleteKategoriPayment(req, res) {
    try {
      await kategoriPaymentService.deleteKategoriPayment(req.user.id, req.params.id);
      res.status(200).json({ message: 'Kategori Payment berhasil dihapus.' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = KategoriPaymentController;
