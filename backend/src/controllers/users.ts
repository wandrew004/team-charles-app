import { User } from '../models/init-models';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

/**
* Get all users (excluding passwords)
*/
export const getAllUsers = async (): Promise<Partial<User>[]> => {
    return User.findAll({
        attributes: ['id', 'username'],
    });
};

/**
* Get a single user by ID (excluding password)
*/
export const getUserById = async (id: number): Promise<Partial<User> | null> => {
    return User.findByPk(id, {
        attributes: ['id', 'username'],
    });
};

/**
* Get a single user by ID including password (for authentication)
*/
export const getUserByIdWithPassword = async (id: number): Promise<User | null> => {
    return User.findByPk(id);
};

/**
* Get a single user by username including password (for authentication)
*/
export const getUserByUsername = async (username: string): Promise<User | null> => {
    return User.findOne({ where: { username } });
};

/**
* Create a new user with hashed password
*/
export const createUser = async (
    username: string,
    password: string
): Promise<User> => {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    return User.create({
        username,
        password: hashedPassword,
    });
};

/**
* Update an existing user, with optional password hashing
*/
export const updateUser = async (
    id: number,
    username?: string,
    password?: string
): Promise<void> => {
    const updateData: Partial<{ username: string; password: string }> = {};
    
    if (username) updateData.username = username;
    if (password) updateData.password = await bcrypt.hash(password, SALT_ROUNDS);
    
    await User.update(updateData, {
        where: { id },
    });
};

/**
* Delete a user
*/
export const deleteUser = async (id: number): Promise<void> => {
    await User.destroy({
        where: { id },
    });
};

/**
* Verify if a provided password matches the stored hashed password
*/
export const verifyPassword = async (
    user: User,
    password: string
): Promise<boolean> => {
    return bcrypt.compare(password, user.password);
};
