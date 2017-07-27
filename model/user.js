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
            
        }
    });
}

module.exports = {
    AddUser: AddUser,
    findUserByName: findUserByName
};