const mongoose = require('../lib/mongo.js'),
    logger = require('../logger/logger.js'),
    BillSchema = require('./bill.js').BillSchema,
    Schema = mongoose.Schema;
let UserSchema = new Schema({
    name: String,
    password: String,
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

module.exports = {
    AddUser: AddUser,
    findUserByName: findUserByName
};