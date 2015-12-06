exports.checkLogin = function (req, res, next) {
    if (!req.session.user) {
        req.flash('error', '请先登陆');
        return res.redirect('/user/login');
    }
    next();
};

exports.checkNotLogin = function (req, res, next) {
    if (req.session.user) {
        req.flash('success', '已登陆');
        return res.redirect('back');
    }
    next();
};