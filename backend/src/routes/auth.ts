import { Router, Request, Response, NextFunction } from 'express';
import passport from 'passport';

const router = Router();

/**
 * @brief Login route using passport local strategy
 * @param {string} username - The username
 * @param {string} password - The password
 * @returns {Object} The authenticated user (excluding password)
 */
router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('local', async (err: Error, user: Express.User, info: { message: string }) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({ error: info.message });
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            // Don't send the password back
            return res.status(200).json({ message: `logged in as ${user.username}` });
        });
    })(req, res, next);
});

/**
 * @brief Logout route
 */
router.post('/logout', (req: Request, res: Response, next: NextFunction) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.status(200).json({ message: 'Logged out successfully' });
    });
});

/**
 * @brief Get current user route
 */
router.get('/me', async (req: Request, res: Response) : Promise<void> => {
    if (!req.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
    }
    // Don't send the password back
    res.status(200).json( { username: req.user.username } );
});

export default router; 