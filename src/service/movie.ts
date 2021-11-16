import config from '../config';
import axios from "axios";

export default class MovieService {
    static async searchMovie(name: string) {
        const { data } = await axios.get(`${config.baseUrl}&t=${name}`);
        return data.Error ? null : data;
    }
}