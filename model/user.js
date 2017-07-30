const mongoose = require('../lib/mongo.js'),
    logger = require('../logger/logger.js'),
    userService = require('./userService.js'),
    Schema = mongoose.Schema;
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
    }),
    MonthBillSchema = new Schema({
        billDetails: [ItemSchema],
        inputAmount: Number,
        outputAmount: Number,
        billMonth: String
    }),
    UserSchema = new Schema({
        name: { type: String, required: true },
        password: { type: String, required: true },
        email: String,
        monthBills: [MonthBillSchema],
        bills: [BillSchema]
    }),
    User = mongoose.model('User', UserSchema);

function AddUser(data) {
    let user = new User({
        name: data.username,
        password: data.password,
        email: data.email
    });
    user.save(function (err, res) {
        if (err) {
            logger.error('add user ' + data.name + ' error.Error:' + err);
        } else {
            logger.info('add user ' + data.name + ' successful.');
        }
    });
}

function findUserByName(name) {
    return User.findOne({ name: name }, function (err, res) {
        if (err) {
            logger.error('findUserByName Error:' + err);
        } else {
            return res;
        }
    });
}

function changeUserBills(data) {
    User.findOne({ name: data.name }, (err, res) => {
        if (err) {
            logger.error('changeUserBills Error:' + err);
        } else {
            let bills = res.bills, existBill = false;
            for (let i = 0; i < bills.length; i++) {
                if (bills[i].billDate === data.billDate) {
                    existBill = true;
                    res.bills[i].inputAmount = data.inputAmount;
                    res.bills[i].outputAmount = data.outputAmount;
                    res.bills[i].billDetails = data.billDetails;
                    userService.changeMonthBills(res, data, true, i);
                    break;
                }
            }
            if (!existBill) {
                res.bills.push(data);
                userService.changeMonthBills(res, data, false);
            }
            res.save((error) => {
                if (error) {
                    logger.error('changeUserBills Error:' + err);
                } else {
                    logger.info('changeUserBills ' + data.name + ' successful.');
                }
            });
        }
    });
}

function getAllBillsByUsername(name) {
    return User.findOne({ name: name }, (err, res) => {
        if (err) {
            logger.error('getAllBillsByUsername Error:' + err);
            return [];
        } else {
            return res.bills;
        }
    });
}

function getBillDetailsByUsernameAndDate(name, date) {
    return User.findOne({ name: name }, (err, res) => {
        if (err) {
            logger.error('getBillDetailsByUsername Error:' + err);
        } else {
            let bills = res.bills;
            for (let i = 0; i < bills.length; i++) {
                if (bills[i].billDate === date) {
                    return bills[i].billDetails;
                }
            }
            return [];
        }
    });
}

module.exports = {
    AddUser: AddUser,
    findUserByName: findUserByName,
    changeUserBills: changeUserBills,
    getAllBillsByUsername: getAllBillsByUsername,
    getBillDetailsByUsernameAndDate: getBillDetailsByUsernameAndDate
};