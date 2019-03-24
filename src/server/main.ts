import * as log4js from 'log4js';

// log4jsの初期化
log4js.configure({
    appenders: {
        system: { type: 'file', filename: 'system.log' }
    },
    categories: {
        default: { appenders: ['system'], level: 'debug' },
    }
});

const main = async () => {
    const logger = log4js.getLogger('system');
    let logmsg = "";

    logmsg = 'main start';
    console.log(logmsg);
    logger.trace(logmsg);

    logmsg = 'main end';
    console.log(logmsg);
    logger.trace(logmsg);
}

main();