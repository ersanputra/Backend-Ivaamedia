const ProductCategoryService = require('../services/ProductCategoryService');
const productCategoryService = new ProductCategoryService();

class ProductCategoryController {
  static async createProductCategory(req, res) {
    try {
      const category = await productCategoryService.createProductCategory(req.body);
      res.status(201).json(category);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getAllProductCategories(req, res) {
    try {
      const categories = await productCategoryService.getAllProductCategories();
      res.status(200).json(categories);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getProductCategoryById(req, res) {
    try {
      const category = await productCategoryService.getProductCategoryById(req.params.id);
      res.status(200).json(category);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getProductCategoryByUserId(req, res) {
    try {
      const categories = await productCategoryService.getProductCategoryByUserId(req.params.userId);
      res.status(200).json(categories);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async updateProductCategory(req, res) {
    try {
      const category = await productCategoryService.updateProductCategory(req.params.id, req.body);
      res.status(200).json(category);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async deleteProductCategory(req, res) {
    try {
      await productCategoryService.deleteProductCategory(req.params.id);
      res.status(200).json({ message: 'Product category successfully deleted.' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = ProductCategoryController;
