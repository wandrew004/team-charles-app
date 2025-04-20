import { User } from '../../src/models/user';
import * as userController from '../../src/controllers/users';
import bcrypt from 'bcrypt';

// Mock the User model
jest.mock('../../src/models/user');
jest.mock('bcrypt');

describe('User Controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getUsers', () => {
        it('should return all users', async () => {
            const mockUsers = [
                { id: 1, username: 'user1', password: 'hashed1' },
                { id: 2, username: 'user2', password: 'hashed2' }
            ];
            (User.findAll as jest.Mock).mockResolvedValue(mockUsers);

            const result = await userController.getUsers();
            expect(result).toEqual(mockUsers);
            expect(User.findAll).toHaveBeenCalledTimes(1);
        });
    });

    describe('getUserById', () => {
        it('should return a user by id', async () => {
            const mockUser = { id: 1, username: 'user1', password: 'hashed1' };
            (User.findByPk as jest.Mock).mockResolvedValue(mockUser);

            const result = await userController.getUserById(1);
            expect(result).toEqual(mockUser);
            expect(User.findByPk).toHaveBeenCalledWith(1);
        });

        it('should return null when user not found', async () => {
            (User.findByPk as jest.Mock).mockResolvedValue(null);

            const result = await userController.getUserById(999);
            expect(result).toBeNull();
            expect(User.findByPk).toHaveBeenCalledWith(999);
        });
    });

    describe('getUserByUsername', () => {
        it('should return a user by username', async () => {
            const mockUser = { id: 1, username: 'user1', password: 'hashed1' };
            (User.findOne as jest.Mock).mockResolvedValue(mockUser);

            const result = await userController.getUserByUsername('user1');
            expect(result).toEqual(mockUser);
            expect(User.findOne).toHaveBeenCalledWith({ where: { username: 'user1' } });
        });

        it('should return null when user not found', async () => {
            (User.findOne as jest.Mock).mockResolvedValue(null);

            const result = await userController.getUserByUsername('nonexistent');
            expect(result).toBeNull();
            expect(User.findOne).toHaveBeenCalledWith({ where: { username: 'nonexistent' } });
        });
    });

    describe('createUser', () => {
        it('should create a new user with hashed password', async () => {
            const mockUser = { id: 1, username: 'newuser', password: 'hashed123' };
            (bcrypt.hash as jest.Mock).mockResolvedValue('hashed123');
            (User.create as jest.Mock).mockResolvedValue(mockUser);

            const result = await userController.createUser('newuser', 'password123');
            expect(result).toEqual(mockUser);
            expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
            expect(User.create).toHaveBeenCalledWith({
                username: 'newuser',
                password: 'hashed123'
            });
        });
    });

    describe('updateUser', () => {
        it('should update user with new username', async () => {
            const mockUpdate = [1, [{ id: 1, username: 'updated', password: 'hashed1' }]];
            (User.update as jest.Mock).mockResolvedValue(mockUpdate);

            const result = await userController.updateUser(1, 'updated');
            expect(result).toEqual(mockUpdate);
            expect(User.update).toHaveBeenCalledWith(
                { username: 'updated' },
                { where: { id: 1 }, returning: true }
            );
        });

        it('should update user with new password', async () => {
            const mockUpdate = [1, [{ id: 1, username: 'user1', password: 'newhashed' }]];
            (bcrypt.hash as jest.Mock).mockResolvedValue('newhashed');
            (User.update as jest.Mock).mockResolvedValue(mockUpdate);

            const result = await userController.updateUser(1, undefined, 'newpassword');
            expect(result).toEqual(mockUpdate);
            expect(bcrypt.hash).toHaveBeenCalledWith('newpassword', 10);
            expect(User.update).toHaveBeenCalledWith(
                { password: 'newhashed' },
                { where: { id: 1 }, returning: true }
            );
        });
    });

    describe('deleteUser', () => {
        it('should delete a user', async () => {
            (User.destroy as jest.Mock).mockResolvedValue(1);

            const result = await userController.deleteUser(1);
            expect(result).toBe(1);
            expect(User.destroy).toHaveBeenCalledWith({ where: { id: 1 } });
        });
    });

    describe('verifyUser', () => {
        it('should verify valid credentials', async () => {
            const mockUser = { id: 1, username: 'user1', password: 'hashed123' };
            (User.findOne as jest.Mock).mockResolvedValue(mockUser);
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);

            const result = await userController.verifyUser('user1', 'password123');
            expect(result).toEqual(mockUser);
            expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashed123');
        });

        it('should return null for invalid password', async () => {
            const mockUser = { id: 1, username: 'user1', password: 'hashed123' };
            (User.findOne as jest.Mock).mockResolvedValue(mockUser);
            (bcrypt.compare as jest.Mock).mockResolvedValue(false);

            const result = await userController.verifyUser('user1', 'wrongpassword');
            expect(result).toBeNull();
        });

        it('should return null for non-existent user', async () => {
            (User.findOne as jest.Mock).mockResolvedValue(null);

            const result = await userController.verifyUser('nonexistent', 'password123');
            expect(result).toBeNull();
            expect(bcrypt.compare).not.toHaveBeenCalled();
        });
    });
}); 