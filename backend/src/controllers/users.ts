import { User } from '../models/user';
import bcrypt from 'bcrypt';

/**
 * Get all users
 * @returns Promise<User[]> - Array of all users
 */
export const getUsers = async (): Promise<User[]> => {
    return await User.findAll();
};

/**
 * Get a user by ID
 * @param id - User ID
 * @returns Promise<User | null> - User object or null if not found
 */
export const getUserById = async (id: number): Promise<User | null> => {
    return await User.findByPk(id);
};

/**
 * Get a user by username
 * @param username - Username to search for
 * @returns Promise<User | null> - User object or null if not found
 */
export const getUserByUsername = async (username: string): Promise<User | null> => {
    return await User.findOne({ where: { username } });
};

/**
 * Create a new user
 * @param username - Username for the new user
 * @param password - Plain text password (will be hashed)
 * @returns Promise<User> - Created user object
 */
export const createUser = async (username: string, password: string): Promise<User> => {
    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(password, 10);
    return await User.create({ username, password: hashedPassword });
};

/**
 * Update a user
 * @param id - User ID
 * @param username - New username
 * @param password - New password (optional, will be hashed if provided)
 * @returns Promise<[number, User[]]> - Number of affected rows and updated users
 */
export const updateUser = async (
    id: number,
    username?: string,
    password?: string
): Promise<[number, User[]]> => {
    const updateData: Partial<User> = {};
    
    if (username) {
        updateData.username = username;
    }
    
    if (password) {
        updateData.password = await bcrypt.hash(password, 10);
    }
    
    return await User.update(updateData, {
        where: { id },
        returning: true
    });
};

/**
 * Delete a user
 * @param id - User ID
 * @returns Promise<number> - Number of deleted users
 */
export const deleteUser = async (id: number): Promise<number> => {
    return await User.destroy({ where: { id } });
};

/**
 * Verify user credentials
 * @param username - Username to verify
 * @param password - Password to verify
 * @returns Promise<User | null> - User object if credentials are valid, null otherwise
 */
export const verifyUser = async (username: string, password: string): Promise<User | null> => {
    const user = await getUserByUsername(username);
    if (!user) {
        return null;
    }
    
    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : null;
}; 