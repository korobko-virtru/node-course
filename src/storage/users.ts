import {User, UserData} from "../types/user";
import config from '../config';
import {decrypt, encrypt} from "../utils/jwt-utils";
import * as crypto from "crypto";

const users: User[] = [
    {
        username: 'test',
        hash: '2737e3a7da8cf88ca84acf6b624bb745069c069468d455eb8088a56c161dbd8365fbf30cd18cbf1c3e8a701f1ee38fed65e55d23b9fd81f70090099ff27c7a93',
        salt: '014fe164da5fc999c26f49b929c9a15c'
    }
]

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
    console.log('{username, hash, salt}', {username, hash, salt});
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

const authenticateUser = (token: string) => {
    const {username} = decrypt(token);
    const user = get(username);
    if (!user) {
        throw new Error('User does not exist');
    }
    return username;
}

export default {
    get,
    add,
    validateUser,
    authenticateUser
}