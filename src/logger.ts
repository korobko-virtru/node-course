import pino from 'pino';
import path from 'path';

const transport = pino.transport({
    target: 'pino/file',
    options: { destination: './logs.txt' }
});

console.log('path: ', path.resolve('./src/transport.ts'));

const logger = pino(transport);

export default logger;