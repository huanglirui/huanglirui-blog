var express = require('express');
var router = express.Router();

//用户注册
router.get('/reg', function(req, res, next) {
  res.render('user/reg', {'title': '用户注册'});
});
router.post('/reg', function(req, res, next) {
    var user = req.body;
    if (user.password != user.repassword) {
        req.flash('error', '两次输入的密码不一致');
        return res.redirect('/user/reg');
    }
    user.password = md5(user.password);
//  获取头像
    user.avatar = "https://secure.gravatar.com/avatar/"+md5(user.email)+"?s=48";
    M('User').findOne({username:user.username}, function (err, result) {
        if (err) {
            console.log(err);
            return res.redirect('/user/reg');
        }
        if (result) {
            req.flash('error', '该用户已存在');
            return res.redirect('/user/reg');
        } else {
            new M('User')(user).save(function (err, result) {
                if (err) {
                    console.log(err);
                    return res.redirect('/user/reg');
                }
                req.flash('success', '注册成功');
                req.session.user = result;
                res.redirect('/');
            });
        }
    });


});

//用户登陆
router.get('/login', function(req, res, next) {
    res.render('user/login', {'title': '用户登陆'});
});
router.post('/login', function(req, res, next) {
    var user = req.body;
    user.password = md5(user.password);
    M('User').findOne({username: user.username}, function (err, u) {
        if (err) {
            return res.redirect('/user/login');
        }
        if (u) {
            if (u.password != user.password) {
            //密码错误
                req.flash('error', '密码错误');
                return res.redirect('/user/login');
            }
            console.log('success');
            req.session.user = u;
            return res.redirect('/');
        } else {
            //用户不存在
            req.flash('error', '用户不存在');
            return res.redirect('/user/reg');
        }
    });
});

//用户退出
router.get('/logout', function(req, res, next) {
    req.session.user = null;
    req.flash('error', '退出成功');
    res.redirect('/');
});

function md5(str){
    return require('crypto').createHash('md5').update(str).digest('hex');
}

module.exports = router;
