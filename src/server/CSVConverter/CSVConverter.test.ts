import { CSVConverter } from './CSVConverter';
import * as log4js from 'log4js';

describe('CSVConverter Class Test', () => {
    beforeAll(() => {
        jest.setTimeout(100000);
        log4js.configure({
            appenders: {
                system: { type: 'file', filename: 'system.log' }
            },
            categories: {
                default: { appenders: ['system'], level: 'debug' },
            }
        });
    });
    describe('readMapFile Method Test', () => {
        test('readMapFile Success', async () => {
            const converter = new CSVConverter();
            const map: any = await converter['readMapFile']('./src/server/CSVConverter/test_files/mapFile.json');
            expect(map.encode).toBeDefined();
            expect(map.encode).toBe('Shift_JIS');
        });
        test('readMapFile readFile failured', async () => {
            const converter = new CSVConverter();
            const readMapFilePromise = converter['readMapFile']('./src/server/CSVConverter/test_files/notfound.json');
            await expect(readMapFilePromise).rejects.toBe('readFile failured');
        });
        test('readMapFile not json format', async () => {
            const converter = new CSVConverter();
            const readMapFilePromise = converter['readMapFile']('./src/server/CSVConverter/test_files/notjson.json');
            await expect(readMapFilePromise).rejects.toBe('not json format');
        });
        test('readMapFile encode undefined', async () => {
            const converter = new CSVConverter();
            const readMapFileUndefinedPromise = converter['readMapFile']('./src/server/CSVConverter/test_files/mapFile_encode_undefined.json');
            await expect(readMapFileUndefinedPromise).rejects.toBe('encode undefined');
            const readMapFileNullPromise = converter['readMapFile']('./src/server/CSVConverter/test_files/mapFile_encode_null.json');
            await expect(readMapFileNullPromise).rejects.toBe('encode undefined');
        });
    });
    describe('readCSVFile Method Test', () => {
        test('readCSVFile Success', async () => {
            const converter = new CSVConverter();
            const encode = 'Shift_JIS'
            const csv: any = await converter['readCSVFile']('./src/server/CSVConverter/test_files/sjis_csv.csv', encode);
            expect(csv[0]['日付']).toBe('2018/7/31');
            expect(csv[0]['情報１']).toBe('一行目１');
            expect(csv[0]['数値３']).toBe('2442');
            expect(csv[0]['情報５']).toBe('未設定');
            expect(csv[17]['日付']).toBe('2018/8/9');
            expect(csv[17]['情報１']).toBe('18行目1');
            expect(csv[17]['数値３']).toBe('1058');
            expect(csv[17]['情報５']).toBe('未設定');
        });
        test('readCSVFile readFile failured', async () => {
            const converter = new CSVConverter();
            const encode = 'Shift_JIS'
            const readCSVFilePromise = converter['readCSVFile']('./src/server/CSVConverter/test_files/notfound.csv', encode);
            await expect(readCSVFilePromise).rejects.toBe('readFile failured');
        });
        test('readCSVFile encoding not exists failured', async () => {
            const converter = new CSVConverter();
            const encode = 'notexists'
            const readCSVFilePromise = converter['readCSVFile']('./src/server/CSVConverter/test_files/sjis_broken.csv', encode);
            await expect(readCSVFilePromise).rejects.toBe('encoding not exists');
        });
        test('readCSVFile parseCsv failured', async () => {
            const converter = new CSVConverter();
            const encode = 'Shift_JIS'
            const readCSVFilePromise = converter['readCSVFile']('./src/server/CSVConverter/test_files/sjis_broken.csv', encode);
            await expect(readCSVFilePromise).rejects.toBe('parseCsv failured');
        });
    });
    describe('mapCSV Test', () => {
        test('mapCSV Success', () => {
            const converter = new CSVConverter();
            const mapInfo = {
                "encode": "Shift_JIS",
                "convert": [{
                    "in": "日付",
                    "out": "date1",
                    "transfer": "date"
                },
                {
                    "in": "数値１",
                    "out": "number1",
                    "transfer": "number"
                },
                {
                    "in": "数値２",
                    "out": "number2_plus",
                    "transfer": "number_plus"
                },
                {
                    "in": "数値２",
                    "out": "number2_minus",
                    "transfer": "number_minus"
                },
                {
                    "in": "情報１",
                    "out": "info1",
                    "transfer": "none"
                },
                {
                    "in": "情報５",
                    "out": "info5",
                    "transfer": "none"
                },
                {
                    "in": "和暦１",
                    "out": "wareki1",
                    "transfer": "date_wareki",
                    "gengo": "H",
                    "delete_string": "H",
                    "delimiter": ".",
                }
                ]
            };
            const csvInfo = [
                {
                    "日付": "2020/1/1",
                    "数値１": "10000",
                    "数値２": "-100",
                    "情報１": "1情報１",
                    "情報２": "1情報２",
                    "情報５": "1情報５",
                    "和暦１": "H29.1.1"
                },
                {
                    "日付": " 2020/12/12",
                    "数値１": "20000",
                    "数値２": "200",
                    "情報１": "2情報１",
                    "情報２": "2情報２",
                    "情報５": "2情報５",
                    "和暦１": "H29.12.12"
                },
                {
                    "日付": "2020/3/13",
                    "数値１": "30000",
                    "数値２": "-300",
                    "情報１": "3情報１",
                    "情報２": "3情報２",
                    "情報５": "3情報５",
                    "和暦１": "H29.3.13"
                },
                {
                    "日付": "2020/12/4",
                    "数値１": "40000",
                    "数値２": "0",
                    "情報１": "4情報１",
                    "情報２": "4情報２",
                    "情報５": "4情報５",
                    "和暦１": "H29.12.4"
                },
                {
                    "日付": "20200505",
                    "数値１": "50000",
                    "数値２": "500",
                    "情報１": "5情報１",
                    "情報２": "5情報２",
                    "情報５": "5情報５",
                    "和暦１": "H29.5.5"
                }
            ];
            const mappedData = converter['mapCSV'](csvInfo, mapInfo);
            expect(mappedData[0].info1).toBe('1情報１');
            expect(mappedData[0].date1.toISOString()).toBe(new Date('2020/1/1').toISOString());
            expect(mappedData[0].number1).toBe(10000);
            expect(mappedData[0].number2_minus).toBe(100);
            expect(mappedData[0].number2_plus).toBe(0);
            expect(mappedData[0].info5).toBe('1情報５');
            expect(mappedData[0].wareki1.toISOString()).toBe(new Date('2017/1/1').toISOString());
            expect(mappedData[1].number2_minus).toBe(0);
            expect(mappedData[1].number2_plus).toBe(200);
            expect(mappedData[1].date1.toISOString()).toBe(new Date('2020/12/12').toISOString());
            expect(mappedData[1].wareki1.toISOString()).toBe(new Date('2017/12/12').toISOString());
            expect(mappedData[2].date1.toISOString()).toBe(new Date('2020/3/13').toISOString());
            expect(mappedData[2].wareki1.toISOString()).toBe(new Date('2017/3/13').toISOString());
            expect(mappedData[3].date1.toISOString()).toBe(new Date('2020/12/4').toISOString());
            expect(mappedData[3].wareki1.toISOString()).toBe(new Date('2017/12/4').toISOString());
            expect(mappedData[4].info1).toBe('5情報１');
            expect(mappedData[4].date1.toISOString()).toBe(new Date('2020/5/5').toISOString());
            expect(mappedData[4].number1).toBe(50000);
            expect(mappedData[4].number2_minus).toBe(0);
            expect(mappedData[4].number2_plus).toBe(500);
            expect(mappedData[4].info5).toBe('5情報５');
            expect(mappedData[4].wareki1.toISOString()).toBe(new Date('2017/5/5').toISOString());
        });
    });
    describe('convertCSV Test', () => {
        test('convertCSV Success', async () => {
            const convert = new CSVConverter();
            const info = await convert.convertCSV('./src/server/CSVConverter/test_files/mapFile.json', './src/server/CSVConverter/test_files/sjis_csv.csv');
            expect(info[0].info1).toBe('一行目１');
            expect(info[0].date1.toISOString()).toBe(new Date('2018/7/31').toISOString());
            expect(info[0].number1).toBe(1);
            expect(info[0].info5).toBe('未設定');
            expect(info[17].date1.toISOString()).toBe(new Date('2018/8/9').toISOString());
            expect(info[17].info1).toBe('18行目1');
            expect(info[17].number1).toBe(1);
            expect(info[17].info5).toBe('未設定');
        });

    });
});