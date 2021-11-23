import express, {NextFunction, Request, Response} from 'express';
import {Movie, MovieQuery} from "../types/movie";
import storage from '../storage/movie';
import usersStorage from '../storage/users';

const router = express.Router();

const MUTATION_METHODS = ['POST', 'PATCH', 'DELETE'];

const getHandler = async (req: Request, res: Response) => {
    const { sortOrder = 'asc', sortBy = 'title', limit = 10, page = 1 } = req.query;
    const movies = await storage.getAll({sortOrder, sortBy, limit, page} as MovieQuery, req.username);
    res.json(movies);
}

const getByIdHandler = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const movie = await storage.get(id);
        res.json(movie);
    } catch (e) {
        res.sendStatus(404);
    }

}

const postHandler = async (req: Request, res: Response) => {
    const movie: Movie = req.body;
    const username = req.username;
    try {
        const id = await storage.add(movie, username!);
        res.json({id});
    } catch (e: any) {
        res.json({error: e.message});
    }

}

const patchHandler = (req: Request, res: Response) => {
    const { id } = req.params;
    const movie = req.body;
    try {
        storage.update(id, movie);
        res.sendStatus(200);
    } catch (e) {
        res.sendStatus(404);
    }

}

const deleteHandler = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await storage.remove(id);
        res.sendStatus(200);
    } catch (e) {
        res.sendStatus(404);
    }
}

const addMovieToFavoriteHandler = async (req: Request, res: Response) => {
    const { id } = req.params;
    await usersStorage.updataUserByName(req.username!, id);
    res.sendStatus(200);
}

const handleMutation = async (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers;
    const token = authorization?.split(' ')[1];
    if(!MUTATION_METHODS.includes(req.method)) {
        req['username'] = token ? await usersStorage.authenticateUser(token) : undefined;
        next();
        return;
    }
    if (!authorization || !token) {
        next(new Error('No token was found'));
    } else {
        req['username'] = await usersStorage.authenticateUser(token);
        next()
    }
}

router.use(handleMutation);
router.get('/', getHandler);
router.post('/', postHandler);
router.get('/:id', getByIdHandler);
router.post('/:id/favorite', addMovieToFavoriteHandler);
router.patch('/:id', patchHandler);
router.delete('/:id', deleteHandler);

export default router;