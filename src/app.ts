import {NextFunction, Request, Response} from "express";
import express from 'express';
import config from './config';
import logger from './logger';
import movieRouter from './router/movies';
import usersStorage from './storage/users';
import getDbConnection from './db';

const dbPath = 'mongodb://localhost:27017/test';
const app = express();
const db = getDbConnection(dbPath);

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    logger.error(`Server error: ${req.originalUrl}, reason: ${err}`);
    if (res.headersSent) {
        return next(err)
    }
    res.status(500).json({error: err.message});
}

app.use((req: Request, res: Response, next: NextFunction) => {
    logger.info(`Request info - url: ${req.url}, params: ${JSON.stringify(req.params)}.`);
    next();
});

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/movies', movieRouter);

app.post('/register', (req: Request, res: Response) => {
    usersStorage.add(req.body)
    res.sendStatus(200);
});

app.post('/login', async (req: Request, res: Response) => {
    try {
        const token = await usersStorage.validateUser(req.body);
        res.json({token});
    } catch ({message}) {
        res.json({error: message});
    }
});

app.get('*', function (req, res) {
    res.status(404).send('Page not found.');
});

app.use(errorHandler);

db
    .on('error', (err) => {
        logger.error(`Failed connecting to db: ${err.message}`);
    })
    .once('open', () => {
        app.listen(config.APP_PORT, () => {
            logger.info(`Server is listening on port ${config.APP_PORT}. Env is ${config.ENV}.`);
        });
    })


process.on('unhandledRejection', (reason, promise) => {
    logger.error(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
});

process.on('uncaughtException', (err, origin) => {
    logger.error(`Unhandled Exception at: ${origin}, reason: ${err}`);
});