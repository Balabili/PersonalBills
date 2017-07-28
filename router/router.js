const User = require('../model/user.js'),
    auth = require('../middlewares/auth.js'),
    logger = require('../logger/logger.js'),
    moment = require('moment'),
    crypto = require('../middlewares/crypto.js');
module.exports = (app) => {
    app.get('/', (req, res) => {
        res.render('login', { LoginContent: true });
    });
    app.get('/register', (req, res) => {
        res.render('register', { RegisterContent: true });
    });
    app.post('/register', async (req, res) => {
        let username = req.body.username, password = crypto.md5Crypto(req.body.password), email = req.body.email, data = {},
            userModel = await User.findUserByName(username);
        if (userModel !== null) {
            res.send(false);
            return;
        }
        data = { username: username, password: password, email: email };
        User.AddUser(data);
        res.send(true);
    });
    app.post('/login', async (req, res) => {
        let username = req.body.username,
            pwd = crypto.md5Crypto(req.body.password),
            rememberMe = Boolean(req.body.rememberMe),
            userModel = await User.findUserByName(username);
        if (userModel === null || userModel.password !== pwd) {
            res.send('用户名不存在或者密码错误');
            return;
        }
        if (rememberMe) {
            req.session.user = username;
            res.send(false);
        }
    });
    app.get('/logout', (req, res) => {
        req.session.destroy(function (err) {
            if (err) {
                logger.error(`Destroy Session Error: ${err}`);
            } else {
                logger.debug('Destroy Session Success.');
                res.redirect('/');
            }
        });
    });
    app.get('/home/billDetails', auth.userRequired, (req, res) => {
        let billDate = req.URLSearchParams.billDate ? req.URLSearchParams.billDate : moment().format('YYYY-MM-DD');
        res.render('home', { HomeContent: true, currentDate: billDate });
    });
    app.post('/getBillDetails', async (req, res) => {
        let currentDate = req.body.date, billDetails = await User.getBillDetailsByUsernameAndDate(req.session.user, currentDate);
        return res.send(billDetails);
    });
    app.post('/home/addBill', async (req, res) => {
        let items = req.body.billItems, input = 0, output = 0, data = {}, details = [];
        for (let i = 0; i < items.length; i++) {
            if (items[i].isInput === 'true') {
                input += Number.parseFloat(items[i].acount);
            } else {
                output += Number.parseFloat(items[i].acount);
            }
            details.push({ item: items[i].item, acount: items[i].acount, isInput: items[i].isInput });
        }
        data.name = req.session.user;
        data.inputAmount = input;
        data.outputAmount = output;
        data.billDate = moment().format('YYYY-MM-DD');
        data.billDetails = details;
        await User.changeUserBills(data);
    });
};