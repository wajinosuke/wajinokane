import { CSVConverter } from './CSVConverter';
import * as mongoose from 'mongoose';
import {ICreditDetail, CreditDetail} from './CreditDetail';

const filepath = './test_files/';
const filename = 'WebDetail201809170253.csv';

const main = async () => {
    await mongoose.connect('mongodb://localhost/wajinokane', { useNewUrlParser: true });
    const converter = new CSVConverter('./test_files/jaccs.json');
    try {
        const data = await converter.convertCsv(filepath + filename);
        //console.log(data);
        const creditDetail = new CreditDetail();
        const insertData:ICreditDetail = {
            using_day: new Date(),
            pay_amount: 3.33,
            detail: 'detail'
        }
        const retInsert = await creditDetail.insertData(<ICreditDetail[]>data, filename);
        const retFind = await creditDetail.findAll();
        console.log(retFind);
        await mongoose.disconnect();
    } catch (e) {
        console.log(e);
    }
}

main();