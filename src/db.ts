import {connect, connection} from "mongoose";

export default function getDbConnection(path: string) {
    connect(path);
    return connection;
}
