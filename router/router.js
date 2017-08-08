const User = require('../model/user.js'),
    UserService = require('../service/userService.js'),
    auth = require('../middlewares/auth.js'),
    logger = require('../logger/logger.js'),
    crypto = require('../middlewares/crypto.js');
module.exports = (app) => {
    app.get('/', (req, res) => {
        if (req.session.user) {
            res.redirect('/home');
        } else {
            res.render('login', { LoginContent: true });
        }
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
    app.get('/home', auth.userRequired, async (req, res) => {
        res.render('home', { HomeContent: true, user: req.session.user });
    });
    app.post('/home/getBillOverviews', async (req, res) => {
        let currentUser = await User.findUserByName(req.session.user),
            monthBills = currentUser.monthBills;
        monthBills.sort(function (a, b) { return a.date > b.date ? -1 : 1; });
        return res.send(monthBills);
    });
    app.post('/home/getMonthBillDetails', async (req, res) => {
        let currentUser = await User.findUserByName(req.session.user), month = req.body.month, daybills = UserService.getDayBills(currentUser, month);
        daybills.sort(function (a, b) { return a.billDate > b.billDate ? 1 : -1; });
        return res.send(daybills);
    });
    app.post('/home/getBillDetails', async (req, res) => {
        let date = req.body.date, currentUser = await User.findUserByName(req.session.user);
        return res.send(UserService.getBillDetails(currentUser, date));
    });
    app.post('/home/addBill', auth.userRequired, async (req, res) => {
        let items = req.body.billItems ? req.body.billItems : [], data = { billDate: req.body.date, name: req.session.user };
        UserService.addBills(items, data);
        await User.changeUserBills(data);
        return res.send(true);
    });
};