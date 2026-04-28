const db = require('../models');

class UserService {
  async getUserById(id) {
    try {
      const user = await db.User.findOne({
        where: { id, isActive: true },
        attributes: ['id', 'name', 'email', 'avatar', 'role', 'createdAt']
      });

      if (!user) {
        throw new Error('User not found');
      }

      return user;
    } catch (error) {
      throw new Error(`Failed to fetch user: ${error.message}`);
    }
  }

  async createUser(userData) {
    try {
      const user = await db.User.create(userData);
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        createdAt: user.createdAt
      };
    } catch (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }

  async updateUser(id, updateData) {
    try {
      const user = await db.User.findOne({
        where: { id, isActive: true }
      });

      if (!user) {
        throw new Error('User not found');
      }

      await user.update(updateData);
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        createdAt: user.createdAt
      };
    } catch (error) {
      throw new Error(`Failed to update user: ${error.message}`);
    }
  }
}

module.exports = new UserService();