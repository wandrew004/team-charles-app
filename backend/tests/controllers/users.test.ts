import {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
} from '../../src/controllers/users';

import { User } from '../../src/models/init-models';
import bcrypt from 'bcrypt';

jest.mock('../../src/models/init-models');

const mockUsers = [
    { id: 1, username: 'alice' },
    { id: 2, username: 'bob' },
];

describe('User Controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('getAllUsers returns all users without passwords', async () => {
        jest.spyOn(User, 'findAll').mockResolvedValue(mockUsers as any);

        const users = await getAllUsers();

        expect(users).toEqual([
            { id: 1, username: 'alice' },
            { id: 2, username: 'bob' },
        ]);
        expect(User.findAll).toHaveBeenCalledTimes(1);
    });

    test('getUserById returns a user without password', async () => {
        jest.spyOn(User, 'findByPk').mockResolvedValue({ id: 1, username: 'alice' } as any);

        const user = await getUserById(1);

        expect(user).toEqual({ id: 1, username: 'alice' });
        expect(User.findByPk).toHaveBeenCalledWith(1, {
            attributes: ['id', 'username'],
        });
    });

    test('createUser creates a new user with hashed password', async () => {
        const plainPassword = 'secret123';
        const hashed = await bcrypt.hash(plainPassword, 10);

        const createMock = jest.spyOn(User, 'create').mockResolvedValue({
            id: 3,
            username: 'charlie',
            password: hashed,
        } as any);

        const result = await createUser('charlie', plainPassword);

        expect(result.username).toBe('charlie');
        expect(bcrypt.compareSync(plainPassword, result.password)).toBe(true);
        expect(createMock).toHaveBeenCalled();
    });

    test('updateUser updates user with hashed password if provided', async () => {
        const plainPassword = 'newpassword';
        
        await updateUser(1, 'updateduser', plainPassword);

        expect(User.update).toHaveBeenCalledWith(
            expect.objectContaining({
                username: 'updateduser',
                password: expect.any(String),
            }),
            { where: { id: 1 } }
        );

        const updatedPassword = (User.update as jest.Mock).mock.calls[0][0].password;
        expect(await bcrypt.compare(plainPassword, updatedPassword)).toBe(true);
    });

    test('deleteUser deletes user by ID', async () => {
        const destroySpy = jest.spyOn(User, 'destroy').mockResolvedValue(1 as any);

        await deleteUser(2);

        expect(destroySpy).toHaveBeenCalledWith({ where: { id: 2 } });
    });
});
