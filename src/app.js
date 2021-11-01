const http = require('http');
const { APP_PORT, ENV } = require('./config');
const logger = require('./logger');

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.write('Hello World!');
    res.end();
});

server.listen({ port: APP_PORT }, () => logger.log(`Server is listening on port ${APP_PORT}. Env is ${ENV}.`));