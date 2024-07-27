const { sequelize, ProductCategory, User, Business, UserBusiness } = require('../models');

class ProductCategoryService {
  async createProductCategory(userId, categoryData) {
    const t = await sequelize.transaction();
    try {
      const category = await ProductCategory.create({
        name: categoryData.name,
        active: categoryData.active || true,
        user_id: userId
      }, { transaction: t });

      await t.commit();
      return category;
    } catch (error) {
      await t.rollback();
      console.error('Failed to create product category:', error);
      throw error;
    }
  }

  async getAllProductCategories(userId) {
    try {
      const categories = await ProductCategory.findAll({
        where: { user_id: userId, active: true },
        include: [{ model: User, as: 'user' }]
      });
      return categories;
    } catch (error) {
      console.error('Failed to fetch product categories:', error);
      throw error;
    }
  }

  async getProductCategoryById(userId, id) {
    try {
      const category = await ProductCategory.findOne({
        where: { id, user_id: userId },
        include: [{ model: User, as: 'user' }]
      });
      if (!category) {
        throw new Error('Product category not found or you do not have access to this category');
      }
      return category;
    } catch (error) {
      console.error('Failed to fetch product category:', error);
      throw error;
    }
  }

  // async getProductCategoryByUserId(userId) {
  //   try {
  //     const categories = await ProductCategory.findAll({
  //       where: { user_id: userId, active: true },
  //       include: [{ model: User, as: 'user' }]
  //     });
  //     if (!categories.length) {
  //       throw new Error('Product categories not found');
  //     }
  //     return categories;
  //   } catch (error) {
  //     console.error('Failed to fetch product categories by user id:', error);
  //     throw error;
  //   }
  // }

  async  getProductCategoryByUserId(userId) {
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
  
      // Fetch product categories for all users within the same business
      const categories = await ProductCategory.findAll({
        where: {
          user_id: userIds,
          active: true
        },
        include: [{
          model: User,
          as: 'user',
          attributes: ['full_name'] // Memilih hanya kolom 'id' dari User (sebagai 'is_user')
        }]
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
  
  

  async  updateProductCategory(userId, id, updateData) {
    const t = await sequelize.transaction();
    try {
      // Check if the user exists in UserBusiness
      const userBusiness = await UserBusiness.findOne({ where: { user_id: userId } });
      if (!userBusiness) {
        throw new Error('User not found in UserBusiness');
      }
  
      const businessId = userBusiness.business_id;
  
      // Fetch the category to be updated
      const category = await ProductCategory.findOne({
        where: { id },
        include: [{
          model: User,
          as: 'user',
          include: [{
            model: Business,
            as: 'businesses',
            through: { attributes: [] },
            where: { id: businessId }
          }]
        }],
        transaction: t
      });
  
      if (!category) {
        throw new Error('Product category not found or you do not have access to this category');
      }
  
      // Check if the user is within the same business
      const categoryUserBusiness = await UserBusiness.findOne({
        where: { user_id: category.user_id, business_id: businessId }
      });
  
      if (!categoryUserBusiness) {
        throw new Error('You do not have access to update this category');
      }
  
      await category.update(updateData, { transaction: t });
  
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
  

  async  deleteProductCategory(userId, id) {
    const t = await sequelize.transaction();
    try {
      // Check if the user exists in UserBusiness
      const userBusiness = await UserBusiness.findOne({ where: { user_id: userId } });
      if (!userBusiness) {
        throw new Error('User not found in UserBusiness');
      }
  
      const businessId = userBusiness.business_id;
  
      // Fetch the category to be deleted
      const category = await ProductCategory.findOne({
        where: { id },
        include: [{
          model: User,
          as: 'user',
          include: [{
            model: Business,
            as: 'businesses',
            through: { attributes: [] },
            where: { id: businessId }
          }]
        }],
        transaction: t
      });
  
      if (!category) {
        throw new Error('Product category not found or you do not have access to this category');
      }
  
      // Check if the user is within the same business
      const categoryUserBusiness = await UserBusiness.findOne({
        where: { user_id: category.user_id, business_id: businessId }
      });
  
      if (!categoryUserBusiness) {
        throw new Error('You do not have access to delete this category');
      }
  
      await category.update({ active: false }, { transaction: t });
  
      await t.commit();
      return { message: 'Product category successfully deleted.' };
    } catch (error) {
      await t.rollback();
      console.error('Failed to delete product category:', error);
      throw error;
    }
  }
  
}

module.exports = ProductCategoryService;
