import express, { Express, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import './config/passport';

import { initModels } from './models/init-models';
import sequelize from './db/client';
import ownedIngredientsRouter from './routes/ownedIngredients';
import aggregationRouter from './routes/aggregation';
import ingredientsRouter from './routes/ingredients';
import unitsRouter from './routes/units';
import recipesRouter from './routes/recipes';
import usersRouter from './routes/users';
import authRouter from './routes/auth';

const app: Express = express();

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    }
}));

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

app.use('/ownedIngredients', ownedIngredientsRouter);
app.use('/aggregation', aggregationRouter);
app.use('/units', unitsRouter);
app.use('/recipes', recipesRouter);
app.use('/ingredients', ingredientsRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
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
