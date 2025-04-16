import request from 'supertest';
import app from '../../src/app';
import { 
    getAllUsers, 
    getUserById, 
    createUser, 
    updateUser, 
    deleteUser 
} from '../../src/controllers/users';

// Mock all controller functions
jest.mock('../../src/controllers/users');

describe('Users Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /', () => {
        it('should return all users', async () => {
            const mockUsers = [
                { id: 1, username: 'user1' },
                { id: 2, username: 'user2' }
            ];
            (getAllUsers as jest.Mock).mockResolvedValue(mockUsers);

            const response = await request(app).get('/users');
            
            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockUsers);
            expect(getAllUsers).toHaveBeenCalledTimes(1);
        });

        it('should handle errors', async () => {
            const error = new Error('Database error');
            (getAllUsers as jest.Mock).mockRejectedValue(error);

            const response = await request(app).get('/users');
            
            expect(response.status).toBe(500);
            expect(response.body.error).toBe('Internal Server Error');
        });
    });

    describe('GET /:id', () => {
        it('should return a specific user', async () => {
            const mockUser = {
                id: 1,
                username: 'testuser',
                toJSON: () => ({ id: 1, username: 'testuser' })
            };
            (getUserById as jest.Mock).mockResolvedValue(mockUser);

            const response = await request(app).get('/users/1');
            
            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockUser.toJSON());
            expect(getUserById).toHaveBeenCalledWith(1);
        });

        it('should return 404 for non-existent user', async () => {
            (getUserById as jest.Mock).mockResolvedValue(null);

            const response = await request(app).get('/users/999');
            
            expect(response.status).toBe(404);
            expect(response.body.error).toBe('User not found');
        });

        it('should return 400 for invalid user ID', async () => {
            const response = await request(app).get('/users/invalid');
            
            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Invalid user ID');
        });
    });

    describe('POST /', () => {
        it('should create a new user', async () => {
            const userData = {
                username: 'newuser',
                password: 'password123'
            };

            (createUser as jest.Mock).mockResolvedValue({
                id: 1,
                username: userData.username,
                toJSON: () => ({ id: 1, username: userData.username })
            });

            const response = await request(app)
                .post('/users')
                .send(userData);
            
            expect(response.status).toBe(201);
            expect(response.body).toEqual({
                id: 1,
                username: userData.username
            });
            expect(createUser).toHaveBeenCalledWith(userData.username, userData.password);
        });

        it('should return 400 for missing required fields', async () => {
            const response = await request(app)
                .post('/users')
                .send({ username: 'testuser' });
            
            expect(response.status).toBe(400);
            expect(response.body.error).toBe('username and password are required');
        });
    });

    describe('PUT /:id', () => {
        it('should update a user', async () => {
            const updateData = {
                username: 'updateduser',
                password: 'newpassword'
            };

            (updateUser as jest.Mock).mockResolvedValue(true);
            (getUserById as jest.Mock).mockResolvedValue({
                id: 1,
                username: updateData.username,
                toJSON: () => ({ id: 1, username: updateData.username })
            });

            const response = await request(app)
                .put('/users/1')
                .send(updateData);
            
            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                id: 1,
                username: updateData.username
            });
            expect(updateUser).toHaveBeenCalledWith(1, updateData.username, updateData.password);
        });

        it('should return 400 for invalid user ID', async () => {
            const response = await request(app)
                .put('/users/invalid')
                .send({ username: 'testuser' });
            
            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Invalid user ID');
        });

        it('should return 400 if no update fields provided', async () => {
            const response = await request(app)
                .put('/users/1')
                .send({});
            
            expect(response.status).toBe(400);
            expect(response.body.error).toBe('At least one of username or password must be provided');
        });
    });

    describe('DELETE /:id', () => {
        it('should delete a user', async () => {
            (deleteUser as jest.Mock).mockResolvedValue(true);

            const response = await request(app).delete('/users/1');
            
            expect(response.status).toBe(200);
            expect(response.body.message).toBe('User deleted successfully');
            expect(deleteUser).toHaveBeenCalledWith(1);
        });

        it('should return 400 for invalid user ID', async () => {
            const response = await request(app).delete('/users/invalid');
            
            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Invalid user ID');
        });
    });
}); 