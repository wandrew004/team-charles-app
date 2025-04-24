// import { Request, Response, NextFunction } from 'express';

// /**
//  * Middleware to check if user is authenticated
//  */
// export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
//     if (req.isAuthenticated()) {
//         return next();
//     }
//     res.status(401).json({ error: 'Unauthorized' });
// };

// /**
//  * Middleware to optionally check authentication
//  * If user is authenticated, req.user will be available
//  * If not, the request will still proceed
//  */
// export const optionalAuth = (req: Request, res: Response, next: NextFunction) => {
//     if (req.isAuthenticated()) {
//         return next();
//     }
//     // Proceed without authentication
//     next();
// }; 