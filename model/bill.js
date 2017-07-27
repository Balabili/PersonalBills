const Schema = require('../lib/mongo.js').Schema;

let ItemSchema = new Schema({
    item: { type: String, required: true },
    acount: { type: String, required: true },
    isInput: { type: Boolean, required: true }
}),
    BillSchema = new Schema({
        billDetails: [ItemSchema],
        inputAmount: Number,
        outputAmount: Number,
        billDate: String
    });

module.exports = {
    BillSchema: BillSchema
};