const mongoose = require('../lib/mongo.js'),
    Schema = mongoose.Schema;
let BillSchema = new Schema({
    inputDetails: String,
    inputAmount: Number,
    outputDetails: String,
    outputAmount: Number,
    summation: Number
});

module.exports = {
    BillSchema: BillSchema
};