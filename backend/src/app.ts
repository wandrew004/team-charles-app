import express, { Express, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import { initModels } from './models/init-models';
import sequelize from './db/client';
import ownedIngredientsRouter from './routes/ownedIngredients';
import aggregationRouter from './routes/aggregation';
import ingredientsRouter from './routes/ingredients';
import unitsRouter from './routes/units';
import recipesRouter from './routes/recipes';

const app: Express = express();

app.use(express.json());
app.use(cors());
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
