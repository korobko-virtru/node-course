import jwt from 'jsonwebtoken';
import config from '../config';

export function encrypt(username: string) {
    return jwt.sign({ username }, config.jwtSecret);
}

export function decrypt(token: string){
    return jwt.verify(token, config.jwtSecret) as {username: string};
}