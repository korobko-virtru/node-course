import express, {Request, Response} from 'express';
import {Movie, MovieQuery} from "../types/movie";
import storage from '../storage/movie';
import { v4 as uuidv4 } from 'uuid';
import MovieService from "../service/movie";
const router = express.Router();

const getHandler = (req: Request, res: Response) => {
    const { sortOrder = 'asc', sortBy = 'title', limit = 10, page = 1 } = req.query;
    const movies = storage.getAll({sortOrder, sortBy, limit, page} as MovieQuery);
    res.json(movies);
}

const getByIdHandler = (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const movie = storage.get(id);
        res.json(movie);
    } catch (e) {
        res.sendStatus(404);
    }

}

const postHandler = async (req: Request, res: Response) => {
    const movie: Movie = req.body;
    movie.id = uuidv4();
    const { name, ...restInfo } = movie;
    const encodedComponent = encodeURIComponent(name);
    const encodedName = encodedComponent.replace('%20', '+');
    try {
        const data = await MovieService.searchMovie(encodedName);
        storage.add(data ? {...data, ...restInfo} : movie);
        res.json({id: movie.id});
    } catch (e) {
        res.json(e);
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

const deleteHandler = (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        storage.remove(id);
        res.sendStatus(200);
    } catch (e) {
        res.sendStatus(404);
    }
}

router.get('/', getHandler);
router.post('/', postHandler);
router.get('/:id', getByIdHandler);
router.patch('/:id', patchHandler);
router.delete('/:id', deleteHandler);

export default router;