import { Router, Request, Response, NextFunction } from 'express';
import { 
    getAllUsers, 
    getUserById, 
    createUser, 
    updateUser, 
    deleteUser 
} from '../controllers/users';

const router = Router();

/**
 * @brief endpoint for getting all users (excluding passwords)
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
});

/**
 * @brief endpoint for getting a specific user by ID (excluding password)
 */
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            res.status(400).json({ error: 'Invalid user ID' });
            return;
        }

        const user = await getUserById(id);
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
});

/**
 * @brief endpoint for creating a new user
 */
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            res.status(400).json({ error: 'username and password are required' });
            return;
        }

        const user = await createUser(username, password);
        res.status(201).json({ 
            id: user.id, 
            username: user.username 
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @brief endpoint for updating a user
 */
router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id, 10);
        const { username, password } = req.body;

        if (isNaN(id)) {
            res.status(400).json({ error: 'Invalid user ID' });
            return;
        }

        if (!username && !password) {
            res.status(400).json({ error: 'At least one of username or password must be provided' });
            return;
        }

        await updateUser(id, username, password);
        const updatedUser = await getUserById(id);
        res.status(200).json(updatedUser);
    } catch (error) {
        next(error);
    }
});

/**
 * @brief endpoint for deleting a user
 */
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            res.status(400).json({ error: 'Invalid user ID' });
            return;
        }

        await deleteUser(id);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        next(error);
    }
});

export default router; 