var express = require('express');
var middleware = require('../middleware');
var router = express.Router();
var markdown = require('markdown').markdown;
var multer = require('multer');
var path = require('path');
var async = require('async');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../public/uploads')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now()+'.'+file.mimetype.slice(file.mimetype.indexOf('/')+1))
    }
})
var upload = multer({ storage:storage});

//添加文章页面
router.get('/add', middleware.checkLogin, function(req, res, next) {
    res.render('article/add', {
        title: '添加文章',
        article: {}
    });
});
//添加文章请求处理
router.post('/add', upload.single('img'), function (req, res, next) {
    if (req.file) {
        req.body.img = path.join('/uploads',req.file.filename);
    }
    var _id = req.body._id;
//  更新文章
    if (_id) {
        var updateObj = {title: req.body.title, content: req.body.content};
        if (req.file) {
            updateObj.img = req.body.img;
        }
        M('Article').update({_id: _id} ,{$set: updateObj}, function (err, result) {
            if (err) {
                console.log(err);
                return res.redirect('back');
            }
            req.flash('success', '更新文章成功');
            res.redirect('/');
        });
    } else {
//  新添加文章
        req.body.user = req.session.user._id;
        delete req.body._id;
        new M('Article')(req.body).save(function (err, article) {
            if (err) {
                req.flash('error', err);
                return res.redirect('/article/add');
            }
            req.flash('success', '发表文章成功');
            res.redirect('/');
        });
    }

});

//显示文章的列表
router.get('/list/:pageNum/:pageSize', function (req, res, next) {
    var pageNum = req.params.pageNum;
    var pageSize = req.params.pageSize;
    pageNum = pageNum >0 ? parseInt(pageNum) : 1;
    pageSize = pageSize > 0 ? parseInt(pageSize) : 2;
    var query = {};
    M('Article').count(query, function (err, count) {
        M('Article').find(query).sort({createAt: -1}).skip((pageNum-1)*pageSize).limit(pageSize).populate('user').exec(function (err, articles) {
            if (articles) {
                articles.forEach(function (article) {
                    if (article.content) {
                        article.content = markdown.toHTML(article.content);
                    }
                })
            }
            res.render('index', {
                title:'主页',
                pageNum:pageNum,
                pageSize:pageSize,
                totalPage:Math.ceil(count/pageSize),
                articles:articles
            });
        });
    });


});
//显示每一篇文章的详情，并且更新pv浏览量，并行查询和更新
router.get('/detail/:_id', function (req, res, next) {
    async.parallel([
        function (cb) {
            M('Article').findOne({_id: req.params._id}).populate('user').populate('comments.user').exec(function (err, article) {
                article.content = markdown.toHTML(article.content);
                cb(err, article);
            });
        },
        function (cb) {
            M('Article').update({_id: req.params._id}, {$inc: {pv: 1}}, cb);
        }
    ], function (err, result) {
        res.render('article/detail',{
            title:'查看文章',
            article: result[0],
            user: req.session.user || ''
        });
    })
});

//删除一篇文章
router.get('/delete/:_id', function (req, res, next) {
    M('Article').remove({_id: req.params._id}, function (err, result) {
        if (err) {
            req.flash('error', err);
            return res.redirect('back');
        }
        req.flash('success', '删除文字成功');
        res.redirect('/');
    });
});

//更新一篇文章
router.get('/edit/:_id', function (req, res, next) {
    M('Article').findOne({_id: req.params._id}, function (err, article) {
        res.render('article/add', {
            title: '更新文章',
            article: article
        });
    });
});

//评论
router.post('/comment', middleware.checkLogin, function (req, res, next) {
    var user = req.session.user;
    var _id = req.body._id;
    M('Article').update({_id: _id}, {$push: {comments: {user: user._id, content: req.body.content}}}, function (err, result) {
        if (err) {
            console.log(err);
            return res.redirect('back');
        }
        req.flash('success', '评论成功');
        res.redirect('back');
    });
});

module.exports = router;
