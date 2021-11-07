import {NextFunction, Request, Response} from "express";
import express from 'express';
import config  from './config';
import logger from './logger';
const app = express();

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    logger.error(`Server error: ${origin}, reason: ${err}`);
    if (res.headersSent) {
        return next(err)
    }
    res.status(500);
    res.render('error', { error: err })
}

app.use((req: Request, res: Response, next: NextFunction) => {
    logger.info(`Request info - url: ${req.url}, params: ${JSON.stringify(req.params)}.`);
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!')
});

app.post('/user', (req: Request, res: Response) => {
    console.log('body', req.body);
    res.send('Hello User!')
});

app.get('*', function(req, res){
    res.status(404).send('Page not found.');
});

app.use(errorHandler);

app.listen(config.APP_PORT, () => {
    logger.info(`Server is listening on port ${config.APP_PORT}. Env is ${config.ENV}.`);
})

process.on('unhandledRejection', (reason, promise) => {
    logger.error(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
})

process.on('uncaughtException', (err, origin) => {
    logger.error(`Unhandled Exception at: ${origin}, reason: ${err}`);
});