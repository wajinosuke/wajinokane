import * as fs from 'fs';
import * as parseCsv from 'csv-parse';
import * as iconv from 'iconv-lite';
import * as moment from 'moment';

export class CSVConverter {
    _mapFilename: string;
    _mapJson: any;
    constructor(mapFilename: string) {
        this._mapFilename = mapFilename;
        this._readMapFile();
    }
    private _readMapFile() {
        var _mapJson = JSON.parse(fs.readFileSync(this._mapFilename, 'utf8'));
    }
    public convertCsv(csvFilename:string){
        return new Promise((resolve,reject)=> {
            const filecontent = fs.readFileSync(csvFilename);
            const decodecontent = iconv.decode(filecontent,this._mapJson.encode);
            console.log(moment('20181111'))
            console.log(decodecontent);
            const parseOption = {

            };
            parseCsv(decodecontent,parseOption,(err, data) => {
                if(err){
                    reject(err);
                }
                resolve(data);
            });
        })
    }
}