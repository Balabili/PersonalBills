const User = require('../model/user.js'),
    auth = require('../middlewares/auth.js'),
    logger = require('../logger/logger.js'),
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
    app.get('/home', auth.userRequired, (req, res) => {
        res.render('home', { HomeContent: true });
    });
};