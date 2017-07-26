function userRequired(req, res, next) {
    if (!req.session || !req.session.user) {
        return res.render('login', { LoginContent: true });
    }
    next();
}

module.exports = {
    userRequired: userRequired
};