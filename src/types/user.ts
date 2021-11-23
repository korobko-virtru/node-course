export interface User {
    username: string;
    hash: string;
    salt: string;
    favMovies: string[];
}

export interface UserData {
    username: string;
    userpassword: string;
}
