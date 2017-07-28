const mongoose = require('../lib/mongo.js'),
    logger = require('../logger/logger.js'),
    BillSchema = require('./bill.js').BillSchema,
    Schema = mongoose.Schema;
let UserSchema = new Schema({
    name: { type: String, required: true },
    password: { type: String, required: true },
    email: String,
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
                    break;
                }
            }
            if (!existBill) {
                res.bills.push(data);
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

function getBillDetailsByUsernameAndDate(name, date) {
    return User.findOne({ name: name }, function (err, res) {
        if (err) {
            logger.error('getBillDetailsByUsername Error:' + err);
        } else {
            let bills = res.bills;
            for (let i = 0; i < bills.length; i++) {
                if (bills[i].billDate === date) {
                    return bills[i].billDetails;
                }
            }
        }
    });
}

module.exports = {
    AddUser: AddUser,
    findUserByName: findUserByName,
    changeUserBills: changeUserBills,
    getBillDetailsByUsername: getBillDetailsByUsername
};