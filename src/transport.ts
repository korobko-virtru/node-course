import { createWriteStream } from 'fs'

export default (options: any) => {
    return createWriteStream(options.destination)
}
