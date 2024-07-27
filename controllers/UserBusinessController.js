const UserBusinessService = require('../services/UserBusinessService');
const userBusinessService = new UserBusinessService();

class UserBusinessController {
  async createUserBusiness(req, res) {
    try {
      const { userId, businessId } = req.body;
      const userBusiness = await userBusinessService.createUserBusiness({ user_id: userId, business_id: businessId });
      res.status(201).json({
        status: 'success',
        data: userBusiness,
      });
    } catch (error) {
      res.status(400).json({
        status: 'failed',
        message: error.message,
      });
    }
  }

  async getAllUserBusinesses(req, res) {
    try {
      const userBusinesses = await userBusinessService.getAllUserBusinesses();
      res.status(200).json({
        status: 'success',
        data: userBusinesses,
      });
    } catch (error) {
      res.status(400).json({
        status: 'failed',
        message: error.message,
      });
    }
  }

  async getUserBusinessById(req, res) {
    try {
      const { id } = req.params;
      const userBusiness = await userBusinessService.getUserBusinessById(id);
      res.status(200).json({
        status: 'success',
        data: userBusiness,
      });
    } catch (error) {
      res.status(404).json({
        status: 'failed',
        message: error.message,
      });
    }
  }

  async getUserBusinessesByUserId(req, res) {
    try {
      const { userId } = req.params;
      const userBusinesses = await userBusinessService.getUserBusinessesByUserId(userId);
      res.status(200).json({
        status: 'success',
        data: userBusinesses,
      });
    } catch (error) {
      res.status(400).json({
        status: 'failed',
        message: error.message,
      });
    }
  }

  async updateUserBusiness(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const userBusiness = await userBusinessService.updateUserBusiness(id, updateData);
      res.status(200).json({
        status: 'success',
        data: userBusiness,
      });
    } catch (error) {
      res.status(400).json({
        status: 'failed',
        message: error.message,
      });
    }
  }

  async deleteUserBusiness(req, res) {
    try {
      const { id } = req.params;
      await userBusinessService.deleteUserBusiness(id);
      res.status(200).json({
        status: 'success',
        message: 'User business successfully deleted.',
      });
    } catch (error) {
      res.status(404).json({
        status: 'failed',
        message: error.message,
      });
    }
  }
}

module.exports = new UserBusinessController();
