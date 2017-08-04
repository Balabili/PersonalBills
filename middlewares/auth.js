function userRequired(req, res, next) {
    if (!req.session || !req.session.user) {
        return res.redirect('/');
    }
    next();
}

module.exports = {
    userRequired: userRequired
};