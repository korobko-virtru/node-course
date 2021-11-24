import {Schema, model} from 'mongoose';
import {User} from "../types/user";

const UserSchema = new Schema<User>({
    username: {
        type: String,
        required: true,
    },
    hash: {
        type: String,
        required: true,
    },
    salt: {
        type: String,
        required: true,
    },
    favMovies: { type: [String] }
});

const User = model<User>("User", UserSchema);

export default User;