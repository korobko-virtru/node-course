const envDefault = 'dev';

function findArgsValueByKey(key: string, defaultValue: string) {
    const args = process.argv;
    const reg = new RegExp('^(-{2})?(' + key + ')$', 'i');
    const ind = args.findIndex((arg) => reg.test(arg));
    return args[ind+1] ? args[ind+1] : defaultValue;
}

export default {
    APP_PORT: process.env.APP_PORT || 8000,
    ENV: findArgsValueByKey('env', envDefault)
}