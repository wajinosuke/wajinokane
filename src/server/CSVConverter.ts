import * as fs from 'fs';
import * as parseCsv from 'csv-parse';
import * as iconv from 'iconv-lite';
import * as moment from 'moment-timezone';

export class CSVConverter {
    _mapFilename: string;
    _mapJson: any;
    constructor(mapFilename: string) {
        this._mapFilename = mapFilename;
        this._mapJson = this._readMapFile(mapFilename);
    }

    private _readMapFile(mapFilename: string) {
        return JSON.parse(fs.readFileSync(mapFilename, 'utf8'));
    }

    public convertCsv(csvFilename: string) {
        return new Promise((resolve, reject) => {
            const filecontent = fs.readFileSync(csvFilename);
            const decodecontent = iconv.decode(filecontent, this._mapJson.encode);
            const parseOption = {
                ltrim: true,
                rtrim: true,
                skip_empty_lines: true,
                columns: true,
            };
            parseCsv(decodecontent, parseOption, (err, data) => {
                if (err) {
                    reject(err);
                }
                resolve(this._convertData(data));
            });
        })
    }

    private _convertData(data: any) {
        let ret = [];
        for (const row of data) {
            ret.push(this._convertRow(row));
        }
        return ret;
    }

    private _convertRow(row: any) {
        let ret = {};
        for (const key in row) {
            const rules = this._getMapRules(key);
            for (let rule of rules) {
                ret[rule.out] = this._convertType(rule, row[key]);
            }
        }
        return ret;
    }

    private _getMapRules(colKey: string) {
        return this._mapJson.map.filter((elem) => {
            if (elem.in === colKey) return true;
        });
    }

    private _convertType(rule: any, data: any) {
        switch (rule.type) {
            case 'string':
                return String(data);
            case 'number':
                return Number(data);
            case 'date':
                if (!data) {
                    return null;
                }
                if (!rule.format) {
                    throw 'CSVConverter:error format';
                }
                return moment.tz(data, data.format, 'Asia/Tokyo').toDate();
            default:
                return '';
        }
    }
}