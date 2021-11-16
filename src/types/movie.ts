export interface Movie {
    [index: string]: any;
}

export interface MoviesList {
    movies: {
        [key: string]: Movie
    };
    total: number;
}
