export interface MovieQuery {
    sortOrder: string;
    sortBy: string;
    limit: number;
    page: number;
}

export interface Movie {
    [index: string]: any;
}

export interface MoviesList {
    movies: {
        [key: string]: Movie
    };
    favorites: {
        [username: string]: Movie[]
    };
    total: number;
}
