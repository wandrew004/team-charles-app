import { Request, Response } from 'express';
import { User } from '../models/user';
import bcrypt from 'bcrypt';

export class UsersController {
  // Create a new user
  async create(req: Request, res: Response) {
    try {
      const { username, password } = req.body;

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        username,
        password: hashedPassword
      });

      // Don't send the password back
      const { password: _, ...userWithoutPassword } = user.toJSON();
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ error: 'Error creating user' });
    }
  }

  // Get all users
  async getAll(req: Request, res: Response) {
    try {
      const users = await User.findAll({
        attributes: { exclude: ['password'] } // Exclude password from response
      });
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching users' });
    }
  }

  // Get a single user by ID
  async getById(req: Request, res: Response) {
    try {
      const user = await User.findByPk(req.params.id, {
        attributes: { exclude: ['password'] } // Exclude password from response
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching user' });
    }
  }

  // Update a user
  async update(req: Request, res: Response) {
    try {
      const { username, password } = req.body;
      const user = await User.findByPk(req.params.id);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // If password is being updated, hash it
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        await user.update({ username, password: hashedPassword });
      } else {
        await user.update({ username });
      }

      // Get updated user without password
      const updatedUser = await User.findByPk(req.params.id, {
        attributes: { exclude: ['password'] }
      });

      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ error: 'Error updating user' });
    }
  }

  // Delete a user
  async delete(req: Request, res: Response) {
    try {
      const user = await User.findByPk(req.params.id);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      await user.destroy();
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Error deleting user' });
    }
  }
} 