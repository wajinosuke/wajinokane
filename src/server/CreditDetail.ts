import * as mongoose from 'mongoose';
import * as uuid from 'uuid/v4';

// インターフェースを定義
export interface ICreditDetail {
    using_day: Date;
    detail: String;
    pay_amount: Number;
    insert_key?: String;
}

export interface ICreditDetailModel extends ICreditDetail, mongoose.Document {

}

export class CreditDetail {
    CreditDetailModel: mongoose.Model<ICreditDetailModel>;
    CreditDetailSchema: mongoose.Schema;
    constructor() {
        // スキーマを定義
        this.CreditDetailSchema = new mongoose.Schema({
            using_day: Date,
            detail: String,
            pay_amount: Number,
            insert_key: String
        })
        this.CreditDetailModel = mongoose.model<ICreditDetailModel>('CreditDetail', this.CreditDetailSchema);
    }

    public insertData(details: ICreditDetail[], insertKey: string = null) :Promise<ICreditDetail[]>{
        let insertKeyUse = insertKey;
        if (!insertKeyUse) {
            insertKeyUse = uuid();
        }
        const insertObjs = details.map((elem): ICreditDetail => {
            return Object.assign({ insert_key: insertKeyUse }, elem)
        });
        return this.CreditDetailModel.insertMany(insertObjs);
    }

    public findAll(): Promise<ICreditDetail[]> {
        const query = this.CreditDetailModel.find({});
        return query.exec();
    }

    public removeByInsertKey(key: string) {

    }
}