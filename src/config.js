function findArgsValueByKey(key, defaultValue) {
    const args = process.argv;
    const reg = new RegExp('^(-{2})?(' + key + ')$', 'i');
    const ind = args.findIndex((arg) => reg.test(arg));
    return args[ind+1] ? args[ind+1] : defaultValue;
}

module.exports = {
    APP_PORT: process.env.APP_PORT || 8000,
    ENV: findArgsValueByKey('env', 'dev')
}