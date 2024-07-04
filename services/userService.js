const { User } = require('../models');
const bcrypt = require('bcrypt');

class UserService {
  async createUser(userData) {
    try {
      if (!userData.email || !userData.password) {
        throw new Error('Email dan password diperlukan');
      }

      const existingUser = await User.findOne({ where: { email: userData.email } });
      if (existingUser) {
        throw new Error('Email sudah digunakan');
      }

      const hashedPassword = await bcrypt.hash(userData.password, 10);

      const user = await User.create({
        ...userData,
        role: 'USER',
        password: hashedPassword,
      });

      return user;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async getAllUsers() {
    try {
      //return await User.findAll({ where: { active: true } });
      return await User.findAll();
    } catch (error) {
      console.error('Failed to fetch users:', error);
      throw error;
    }
  }

  async getUserById(id) {
    try {
      const user = await User.findByPk(id);
      if (!user) {
        throw new Error('Pengguna tidak ditemukan');
      }
      return user;
    } catch (error) {
      console.error('Failed to fetch user:', error);
      throw error;
    }
  }

  async updateUser(id, updateData) {
    try {
      const user = await User.findByPk(id);
      if (!user) {
        throw new Error('Pengguna tidak ditemukan');
      }

      if (updateData.password) {
        updateData.password = await bcrypt.hash(updateData.password, 10);
      }

      await User.update(updateData, { where: { id } });
      return await User.findByPk(id);
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  async deleteUser(id) {
    try {
      const user = await User.findByPk(id);
      if (!user) {
        throw new Error('Pengguna tidak ditemukan');
      }

      await User.update({ active: false }, { where: { id } });
      return { message: 'Pengguna berhasil dinonaktifkan.' };
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }
}

module.exports = UserService;
