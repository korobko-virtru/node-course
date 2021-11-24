import {User, UserData} from "../types/user";
import config from '../config';
import {decrypt, encrypt} from "../utils/jwt-utils";
import * as crypto from "crypto";
import UserModel from "../models/user";

const get = (name: string) => {
    return UserModel.findOne({username: name});
};

const add = async ({username, userpassword}: UserData) => {
    if (!username || !userpassword) {
        throw new Error('Username and password are required');
    }
    const user = await get(username);

    if (user) {
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

    await UserModel.create({username, hash, salt})
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

const validateUser = async ({username, userpassword}: UserData) => {
    const user = await get(username);
    if (!user) {
        throw new Error('User does not exist');
    }

    if (!validatePassword(user, userpassword)) {
        throw new Error('Incorrect user password');
    }
    return encrypt(username);
}

const authenticateUser = async (token: string) => {
    const {username} = decrypt(token);
    const user = await get(username);
    if (!user) {
        throw new Error('User does not exist');
    }
    return username;
}

const updataUserByName = async (username: string, movieId: string) => {
    const user = await UserModel.findOne({username});
    if (!user) {
        throw new Error(`Can not find username: ${username}`);
    }
    const movieSet = new Set(user.favMovies);
    movieSet.add(movieId);
    user.favMovies = [...movieSet];
    await user.save();
}

const getUserMoviesIds = async (username: string) => {
    const user = await get(username);
    return user!.favMovies;
}

export default {
    get,
    add,
    validateUser,
    authenticateUser,
    updataUserByName,
    getUserMoviesIds
}