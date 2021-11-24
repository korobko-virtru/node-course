import {Movie, MovieQuery} from "../types/movie";
import MovieModel from '../models/movie';
import MovieService from "../service/movie";
import userStorage from '../storage/users';

const get = (id: string) => {
    return MovieModel.findById(id);
};

const queryMovies = async (query: any, {
    sortOrder,
    sortBy,
    limit,
    page,
} : MovieQuery) => {
    const limitInt = parseInt(limit);
    const pageInt = parseInt(page);
    return MovieModel
        .find(query)
        .sort({[sortBy]: sortOrder})
        .limit(limitInt)
        .skip(limitInt * (pageInt - 1))
        .exec();
}

const getAll = async (
    movieParams : MovieQuery,
    username?: string
): Promise<{movies: Movie[], favMovies?: Movie[] | undefined}> => {
    let favMovies;
    const movies = await queryMovies({}, movieParams);
    const favMoviesId = username ? await userStorage.getUserMoviesIds(username) : undefined;
    if (favMoviesId) {
        favMovies = await queryMovies({_id: { $in: favMoviesId}}, movieParams);
    }
    return {
        movies,
        ...(favMovies && {favMovies})
    }
};

const add = async (movie: Movie, username: string): Promise<void> => {
    const currentMovie = await MovieModel.findOne({ $or: [ { name: movie.name }, { Title: movie.Title } ] });
    if(currentMovie) {
        throw new Error('Movie already exists');
    }

    const encodedComponent = encodeURIComponent(movie.name);
    const encodedName = encodedComponent.replace('%20', '+');
    const data = await MovieService.searchMovie(encodedName);
    const movieData = !data ? movie : {...data, ...movie};
    const {_id} = await MovieModel.create(movieData);
    await userStorage.updataUserByName(username, _id);
    return _id;
};

const update = async (id: string, data: any): Promise<void> => {
    const currentMovie = await MovieModel.findByIdAndUpdate(id, data);
}

const remove = (id: string): void => {
    MovieModel.findByIdAndRemove(id);
}

export default {
    get,
    getAll,
    add,
    update,
    remove
}