import express, { Request, Response } from 'express';
import passport from '../config/passport';
import { createUser } from '../controllers/users';

const router = express.Router();

// Register route
router.post('/register', async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            res.status(400).json({ message: 'Username and password are required' });
            return;
        }

        const user = await createUser(username, password);
        res.status(201).json({ message: 'User created successfully', user });
    } catch (error: any) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            res.status(400).json({ message: 'Username already exists' });
            return;
        }
        res.status(500).json({ message: 'Error creating user' });
    }
});

// Login route
router.post('/login', passport.authenticate('local'), (req: Request, res: Response) => {
    res.json({ message: 'Login successful', user: req.user });
});

// Logout route
router.post('/logout', (req: Request, res: Response) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ message: 'Error logging out' });
        }
        res.json({ message: 'Logout successful' });
    });
});

// Check authentication status
router.get('/status', (req: Request, res: Response) => {
    if (req.isAuthenticated()) {
        res.json({ authenticated: true, user: req.user });
    } else {
        res.json({ authenticated: false });
    }
});

export default router;
