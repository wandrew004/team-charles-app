import express, { Express, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import session from 'express-session';
import passport from './config/passport';
import { initModels } from './models/init-models';
import sequelize from './db/client';
import ownedIngredientsRouter from './routes/ownedIngredients';
import aggregationRouter from './routes/aggregation';
import ingredientsRouter from './routes/ingredients';
import unitsRouter from './routes/units';
import recipesRouter from './routes/recipes';
import aiRecipesRouter from './routes/aiRecipes';
import authRouter from './routes/auth';

const app: Express = express();

app.use(express.text({ type: 'text/plain' }));
app.use(express.json());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

if(process.env.NODE_ENV !== 'test') {
    initModels(sequelize);
}

/**
 * @brief middleware handler to log requests
 */
app.use((req, res, next) => {
    console.log(
        '---------------------------------------------------\n' +
        `Request received: ${req.method} ${req.originalUrl}\n` +
        `\t- Params: ${JSON.stringify(req.params)}\n` +
        `\t- Query: ${JSON.stringify(req.query)}\n` +
        `\t- Body: ${JSON.stringify(req.body)}`
    );

    const start = Date.now();

    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(
            '---------------------------------------------------\n' +
            `Request resolved: ${req.method} ${req.originalUrl} ${res.statusCode} (${duration}ms)`
        );
    });

    next();
});

app.use('/api/auth', authRouter);
app.use('/api/owned-ingredients', ownedIngredientsRouter);
app.use('/api/aggregation', aggregationRouter);
app.use('/api/ingredients', ingredientsRouter);
app.use('/api/units', unitsRouter);
app.use('/api/recipes', recipesRouter);
app.use('/api/ai-recipes', aiRecipesRouter);

/**
 * @brief global error handler
 */
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(
        '---------------------------------------------------\n' +
        `Request errored: ${req.method} ${req.originalUrl}\n` +
        `\t- Params: ${JSON.stringify(req.params)}\n` +
        `\t- Query: ${JSON.stringify(req.query)}\n` +
        `\t- Body: ${JSON.stringify(req.body)}\n` +
        err.stack || err
    );

    res.status(500).json({ error: 'Internal Server Error' });
    
    next();
});

export default app;
