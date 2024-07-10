const UserService = require('../services/userService');
const { createTokens } = require('../libs/jwt');
const userService = new UserService();

class UserController {
  async createUser(req, res) {
    try {
      const user = await userService.createUser(req.body);
      res.status(201).json({
        status: 'success',
        data: user,
      });
    } catch (error) {
      res.status(400).json({
        status: 'failed',
        message: error.message,
      });
    }
  }

  async getAllUsers(req, res) {
    try {
      const users = await userService.getAllUsers();
      res.status(200).json({
        status: 'success',
        data: users,
      });
    } catch (error) {
      res.status(400).json({
        status: 'failed',
        message: error.message,
      });
    }
  }

  async getUserById(req, res) {
    try {
      const user = await userService.getUserById(req.params.id);
      res.status(200).json({
        status: 'success',
        data: user,
      });
    } catch (error) {
      res.status(404).json({
        status: 'failed',
        message: error.message,
      });
    }
  }

  async updateUser(req, res) {
    try {
      const user = await userService.updateUser(req.params.id, req.body);
      res.status(200).json({
        status: 'success',
        data: user,
      });
    } catch (error) {
      res.status(400).json({
        status: 'failed',
        message: error.message,
      });
    }
  }

  async deleteUser(req, res) {
    try {
      await userService.deleteUser(req.params.id);
      res.status(200).json({
        status: 'success',
        message: 'Pengguna berhasil dinonaktifkan.',
      });
    } catch (error) {
      res.status(404).json({
        status: 'failed',
        message: error.message,
      });
    }
  }

 

  async login(req, res) {
        try {
            const user = await userService.login(req.body.email, req.body.password);

            // Membuat JWT token setelah pengguna berhasil login
            const accessToken = createTokens(user);

            const objekUser = {
                full_name: user.full_name,
                user_id: user.user_id,
                email: user.email,
                phone_number: user.phone_number,
                profile_image: user.profile_image,
                role: user.role,
                accessToken: accessToken,
      
              };
            
            res.status(200).json({
                status: 'success',
                data: objekUser,
                message: 'Login Berhasil!'
            });
        } catch (error) {
            res.status(400).json({
                status: 'error',
                message: error.message
            });
        }
    }
}

module.exports = UserController;
