const { sequelize, ProductCategory, User } = require('../models');

class ProductCategoryService {
  async createProductCategory(categoryData) {
    const t = await sequelize.transaction();
    try {
      const category = await ProductCategory.create({
        name: categoryData.name,
        active: categoryData.active || true,
        user_id: categoryData.user_id
      }, { transaction: t });

      await t.commit();
      return category;
    } catch (error) {
      await t.rollback();
      console.error('Failed to create product category:', error);
      throw error;
    }
  }

  async getAllProductCategories() {
    try {
      const categories = await ProductCategory.findAll({
        where: { active: true },
        include: [{ model: User, as: 'user' }]
      });
      return categories;
    } catch (error) {
      console.error('Failed to fetch product categories:', error);
      throw error;
    }
  }

  async getProductCategoryById(id) {
    try {
      const category = await ProductCategory.findByPk(id, {
        include: [{ model: User, as: 'user' }]
      });
      if (!category) {
        throw new Error('Product category not found');
      }
      return category;
    } catch (error) {
      console.error('Failed to fetch product category:', error);
      throw error;
    }
  }

  async getProductCategoryByUserId(userId) {
    try {
      const categories = await ProductCategory.findAll({
        where: { user_id: userId, active: true },
        include: [{ model: User, as: 'user' }]
      });
      if (!categories.length) {
        throw new Error('Product categories not found');
      }
      return categories;
    } catch (error) {
      console.error('Failed to fetch product categories by user id:', error);
      throw error;
    }
  }

  async updateProductCategory(id, updateData) {
    const t = await sequelize.transaction();
    try {
      const category = await ProductCategory.findOne({ where: { id }, transaction: t });
      if (!category) {
        throw new Error('Product category not found');
      }

      await ProductCategory.update(updateData, {
        where: { id },
        transaction: t
      });

      await t.commit();
      return await ProductCategory.findOne({
        where: { id },
        include: [{ model: User, as: 'user' }]
      });
    } catch (error) {
      await t.rollback();
      console.error('Failed to update product category:', error);
      throw error;
    }
  }

  async deleteProductCategory(id) {
    try {
      const category = await ProductCategory.findByPk(id);
      if (!category) {
        throw new Error('Product category not found');
      }

      await ProductCategory.update({ active: false }, { where: { id } });
      return { message: 'Product category successfully deleted.' };
    } catch (error) {
      console.error('Failed to delete product category:', error);
      throw error;
    }
  }
}

module.exports = ProductCategoryService;
