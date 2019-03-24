import * as fs from 'fs';
import * as parseCsv from 'csv-parse';
import * as iconv from 'iconv-lite';
import * as moment from 'moment';
import * as log4js from 'log4js'
import { metaProperty } from '@babel/types';

export class CSVConverter {
    /**
     * マップファイルの文字コード
     */
    static readonly MAP_FILE_ENCODE = 'utf8';
    static readonly WAREKI_GAP = {
        'H': 1988
    };

    /**
     * マップファイルを読み込み、JSON形式でマップ情報を返す
     * @param fileName マップファイル名
     * @returns マップ情報
     */
    private readMapFile(fileName: string) {
        return new Promise((resolve, reject) => {
            let logmsg = '';
            fs.readFile(
                fileName,
                {
                    encoding: CSVConverter.MAP_FILE_ENCODE
                }
                , (err, data) => {
                    const logger = log4js.getLogger('system');
                    logmsg = 'CSVConverter readMapFile mapFileName.';
                    logger.trace(fileName);

                    if (err) {
                        logmsg = 'CSVConverter readMapFile readFile failured.';
                        logger.error(logmsg);
                        logger.error(err);
                        reject('readFile failured');
                        return;
                    }
                    logmsg = 'CSVConverter readMapFile readFle success.';
                    logger.trace(logmsg);

                    // ファイルをJSON形式に変換
                    let mapJson: any = {};
                    try {
                        mapJson = JSON.parse(data);
                    } catch (e) {
                        logmsg = 'CSVConverter readMapFile not json format.';
                        logger.error(logmsg);
                        reject('not json format');
                        return;
                    }

                    // マップファイルがencode情報を持たない場合、終了
                    if (!mapJson.encode) {
                        logmsg = 'CSVConverter readMapFile encode undefind.';
                        logger.error(logmsg);
                        logger.error(data);
                        reject('encode undefined');
                        return;
                    }
                    logmsg = 'CSVConverter readMapFile readFle success.';
                    logger.trace(logmsg);
                    resolve(mapJson);
                }
            );
        });
    }
    private readCSVFile(fileName: string, fileEncode: string) {
        let logmsg = '';
        return new Promise((resolve, reject) => {
            fs.readFile(
                fileName,
                (err, data) => {
                    const logger = log4js.getLogger('system');

                    // エンコードの存在チェック
                    if (!iconv.encodingExists(fileEncode)) {
                        reject('encoding not exists');
                        return;
                    }
                    // CSVファイルの読み込み
                    logmsg = 'CSVConverter readCSVFile fileName.';
                    logger.trace(fileName);
                    if (err) {
                        logmsg = 'CSVConverter readCSVFile readFile failured.';
                        logger.error(logmsg);
                        logger.error(err);
                        reject('readFile failured');
                        return;
                    }
                    logmsg = 'CSVConverter readCSVFile readFile success.';
                    logger.trace(logmsg);

                    // 文字コードを変換
                    const decodecontent = iconv.decode(data, fileEncode);

                    // CSVをJSONに変換
                    parseCsv(decodecontent,
                        {
                            columns: true
                        },
                        (err, data) => {
                            if (err) {
                                logmsg = 'CSVConverter readCSVFile parseCsv failured.';
                                logger.error(logmsg);
                                logger.error(err);
                                reject('parseCsv failured');
                                return;
                            }
                            logmsg = 'CSVConverter readCSVFile success.';
                            logger.trace(logmsg);
                            resolve(data);
                        });
                });
        })
    }
    private mapCSV(csvInfo: any, mapInfo: any) {
        const logger = log4js.getLogger('system');

        // 変換関数を定義
        const convFuncs = {
            'date': (convInfo: any, cellData: string) => {
                return moment(cellData).toDate();
            },
            'date_wareki': (convInfo: any, cellData: string) => {
                const delimiter = convInfo.delimiter;
                const deletedData = cellData.replace(convInfo.delete_string, '');
                const splitDate = deletedData.split(delimiter);
                const year = Number(splitDate[0]) + CSVConverter.WAREKI_GAP[convInfo.gengo];
                return new Date(year, Number(splitDate[1]) - 1, Number(splitDate[2]));
            },
            'number': (convInfo: any, cellData: string) => {
                return Number(cellData);
            },
            'number_plus': (convInfo: any, cellData: string) => {
                const num = Number(cellData);
                return (num > 0) ? num : 0;
            },
            'number_minus': (convInfo: any, cellData: string) => {
                const num = Number(cellData);
                return (num < 0) ? num * -1 : 0;
            },
            'none': (convInfo: any, cellData: string) => {
                return cellData;
            }
        };

        // CSVを一行ずつ処理
        let retData = [];
        for (let record of csvInfo) {
            let retRecord = {};
            for (let convInfo of mapInfo.convert) {
                const cellData = record[convInfo.in];
                const convData = convFuncs[convInfo.transfer](convInfo, cellData);
                retRecord[convInfo.out] = convData;
            }
            retData.push(retRecord);
        }
        return retData;
    }
    public async convertCSV(mapFileName: string, csvFileName: string) {
        const logger = log4js.getLogger('system');
        let logmsg = 'CSVConverter cnvertCSV start';
        logger.trace(logmsg);

        // マップファイルを読み込み
        const mapInfo: any = await this.readMapFile(mapFileName);

        // CSVファイルを読み込み
        const csvInfo: any = await this.readCSVFile(csvFileName, mapInfo.encode);

        // マップより、CSVから読み込んだ情報を変換
        const mappedCsv = this.mapCSV(csvInfo, mapInfo);

        logmsg = 'CSVConverter cnvertCSV end';
        logger.trace(logmsg);

        return mappedCsv;
    }
}