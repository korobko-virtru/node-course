import {User, UserData} from "../types/user";
import config from '../config';
import { encrypt } from "../utils/jwt-utils";
import * as crypto from "crypto";

const users: User[] = []

const get = (name: string) => users.find((user: User) => user.username === name);

const add = ({username, userpassword}: UserData) => {
    if (!username || !userpassword) {
        throw new Error('Username and password are required');
    }
    if (get(username)) {
        throw new Error('User already exists');
    }

    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(
        userpassword,
        salt,
        config.cryptoConf.iterations,
        config.cryptoConf.keylen,
        config.cryptoConf.digest
    ).toString(`hex`);
    users.push({username, hash, salt});
}

const validatePassword = (user: User, userpassword: string) => {

    const hash = crypto.pbkdf2Sync(
        userpassword,
        user.salt,
        config.cryptoConf.iterations,
        config.cryptoConf.keylen,
        config.cryptoConf.digest
    ).toString(`hex`);

    return user.hash === hash;
}

const validateUser = ({username, userpassword}: UserData) => {
    const user = get(username);
    if (!user) {
        throw new Error('User does not exist');
    }

    if (!validatePassword(user, userpassword)) {
        throw new Error('Incorrect user password');
    }
    return encrypt(username);
}

export default {
    get,
    add,
    validateUser
}