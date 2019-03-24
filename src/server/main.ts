import { CSVConverter } from './CSVConverter/CSVConverter';
import * as log4js from 'log4js';
import * as json2csv from 'json2csv';
import * as fs from 'fs';

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

    // 引数の取得
    const mapFilename = process.argv[2];
    const csvFilename = process.argv[3];
    const outputFilename = process.argv[4];

    // 変換の実行
    const converter = new CSVConverter();
    const convertedData = await converter.convertCSV(mapFilename, csvFilename);
    const outputData = json2csv.parse(convertedData);

    fs.writeFileSync(outputFilename, outputData);

    logmsg = 'main end';
    console.log(logmsg);
    logger.trace(logmsg);
}

main();