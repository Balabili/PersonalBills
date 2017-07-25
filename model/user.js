const mongoose = require('../lib/mongo.js'),
    logger = require('../logger/logger.js'),
    BillSchema = require('./bill.js').BillSchema,
    Schema = mongoose.Schema;
let UserSchema = new Schema({
    name: String,
    password: String,
    bills: [BillSchema]
}),
    User = mongoose.model('User', UserSchema);

function AddUser(data) {
    let user = new User({
        name: data.name,
        password: data.password
    });
    user.save(function (err, res) {
        if (err) {
            logger.error('add user ' + data.name + ' error.Error:' + err);
        } else {
            logger.info('add user ' + data.name + ' successful.');
        }
    });
}

function findUser(data) {
    let user = new User({
        name: data.username,
        password: data.password
    });
    return User.find(user, function (err, result) {
        if (err) {
            logger.error('findUser Error:' + err);
        } else {
            return result;
        }
    });
}

function findUserByName(data) {
    let user = new User({
        name: data.username
    });
    return User.findOne(user, function (err, res) {
        if (err) {
            logger.error('findUserByName Error:' + err);
        } else {
            return res;
        }
    });
}

module.exports = {
    AddUser: AddUser,
    findUser: findUser,
    findUserByName: findUserByName
};