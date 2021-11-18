export interface User {
    username: string;
    hash: string;
    salt: string;
}

export interface UserData {
    username: string;
    userpassword: string;
}
