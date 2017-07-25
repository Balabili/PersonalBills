const User = require('../model/user.js');
module.exports = (app) => {
    app.get('/', (req, res) => {
        res.render('login', { LoginContent: true });
    });
    app.post('/login', (req, res) => {
        let username = req.body.username,
            pwd = req.body.password,
            rememberMe = Boolean(req.body.rememberMe),
            usernamePassValidation = /^[a-zA-Z0-9\u4e00-\u9fa5]+$/.test(username) && username.length > 7 && username.length < 13;
        if (!usernamePassValidation) {
            res.send([false, '用户名不合法']);
            return;
        } else {
            let userModel = User.findUserByName({ username: username });
            if (userModel === null) {
                res.send(false, '用户名不存在');
                return;
            }
            if (userModel.password !== pwd) {
                res.send([false, '密码错误']);
                return;
            }
        }
        if (rememberMe) {
            req.session.user = username;
            res.render('home');
        }
    });
};