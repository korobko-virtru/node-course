module.exports = {
    log: (msg) => console.log(`[LOGGER]: ${msg}`),
    info: (msg) => console.info(`[LOGGER-INFO]: ${msg}`),
    debug: (msg) => console.debug(`[LOGGER-DEBUG]: ${msg}`),
    error: (msg) => console.error(`[LOGGER-ERROR]: ${msg}`),
    warn: (msg) => console.warn(`[LOGGER-WARNING]: ${msg}`),
};