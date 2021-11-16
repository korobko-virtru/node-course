import pino from 'pino';

const transport = pino.transport({
    target: 'pino/file',
    options: { destination: './logs.txt' }
});

const logger = pino();

export default logger;