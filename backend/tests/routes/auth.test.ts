import request from 'supertest';
import * as userController from '../../src/controllers/users';
import app from '../../src/app';

jest.mock('../../src/controllers/users');

describe('Auth API', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /auth/register', () => {
        it('should register a new user successfully', async () => {
            const mockUser = {
                id: 1,
                username: 'testuser',
                password: 'hashedpassword'
            };
            (userController.createUser as jest.Mock).mockResolvedValue(mockUser);

            const response = await request(app)
                .post('/auth/register')
                .send({
                    username: 'testuser',
                    password: 'password123'
                });

            expect(response.status).toBe(201);
            expect(response.body).toEqual({
                message: 'User created successfully',
                user: mockUser
            });
            expect(userController.createUser).toHaveBeenCalledWith('testuser', 'password123');
        });

        it('should return 400 if username or password is missing', async () => {
            const response = await request(app)
                .post('/auth/register')
                .send({
                    username: 'testuser'
                });

            expect(response.status).toBe(400);
            expect(response.body).toEqual({ message: 'Username and password are required' });
        });

        it('should return 400 if username already exists', async () => {
            (userController.createUser as jest.Mock).mockRejectedValue({ name: 'SequelizeUniqueConstraintError' });

            const response = await request(app)
                .post('/auth/register')
                .send({
                    username: 'existinguser',
                    password: 'password123'
                });

            expect(response.status).toBe(400);
            expect(response.body).toEqual({ message: 'Username already exists' });
        });
    });

    describe('POST /auth/login', () => {
        it('should login user successfully', async () => {
            const mockUser = {
                id: 1,
                username: 'testuser',
                password: 'hashedpassword'
            };
            (userController.verifyUser as jest.Mock).mockResolvedValue(mockUser);

            const agent = request.agent(app);
            const response = await agent
                .post('/auth/login')
                .send({
                    username: 'testuser',
                    password: 'password123'
                });

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                message: 'Login successful',
                user: mockUser
            });
        });

        it('should return 401 for invalid credentials', async () => {
            (userController.verifyUser as jest.Mock).mockResolvedValue(null);

            const response = await request(app)
                .post('/auth/login')
                .send({
                    username: 'testuser',
                    password: 'wrongpassword'
                });

            expect(response.status).toBe(401);
        });
    });

    describe('POST /auth/logout', () => {
        it('should logout user successfully', async () => {
            const agent = request.agent(app);
            
            // First login
            const mockUser = {
                id: 1,
                username: 'testuser',
                password: 'hashedpassword'
            };
            (userController.verifyUser as jest.Mock).mockResolvedValue(mockUser);
            (userController.getUserById as jest.Mock).mockResolvedValue(mockUser);
            
            await agent
                .post('/auth/login')
                .send({
                    username: 'testuser',
                    password: 'password123'
                });

            // Then logout
            const response = await agent
                .post('/auth/logout');

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ message: 'Logout successful' });
        });
    });

    describe('GET /auth/status', () => {
        it('should return authenticated status when user is logged in', async () => {
            const agent = request.agent(app);
            
            // First login
            const mockUser = {
                id: 1,
                username: 'testuser',
                password: 'hashedpassword'
            };
            (userController.verifyUser as jest.Mock).mockResolvedValue(mockUser);
            (userController.getUserById as jest.Mock).mockResolvedValue(mockUser);
            
            await agent
                .post('/auth/login')
                .send({
                    username: 'testuser',
                    password: 'password123'
                });

            // Then check status
            const response = await agent
                .get('/auth/status');

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                authenticated: true,
                user: mockUser
            });
        });

        it('should return unauthenticated status when user is not logged in', async () => {
            const response = await request(app)
                .get('/auth/status');

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                authenticated: false
            });
        });
    });
}); 