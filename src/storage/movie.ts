import {Movie, MoviesList} from "../types/movie";
import sortMovies from '../utils/sort';
import paginateMovies from '../utils/paginate';
import MovieModel from '../models/movie';
import MovieService from "../service/movie";
import userStorage from '../storage/users';

const get = (id: string) => {
    return MovieModel.findById(id);
};

const queryMoviesByIds = async (ids: string[]) => {
    return MovieModel.find({_id: { $in: ids}});
}

const getAll = async (
    {
        sortOrder,
        sortBy,
        limit,
        page,
    } : {
        sortOrder: string,
        sortBy: string,
        limit: number,
        page: number,
    },
    username?: string
): Promise<{movies: Movie[], favMovies?: Movie[] | undefined}> => {
    let favMovies;
    const movies = await MovieModel.find({});
    const sortedMovies = sortMovies(movies, sortOrder, sortBy);
    const allMovies = paginateMovies(sortedMovies, limit, page);
    const favMoviesId = username ? await userStorage.getUserMoviesIds(username) : undefined;
    if (favMoviesId) {
        favMovies = await queryMoviesByIds(favMoviesId);
    }
    return {
        movies: allMovies,
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