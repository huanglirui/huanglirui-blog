var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var db = require('./db');
var routes = require('./routes/index');
var users = require('./routes/users');
var articles = require('./routes/articles');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var flash = require('connect-flash');
var app = express();
var fs = require('fs');

// 视图模板和模板路径
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

var settings = require('./settings');
//session缓存到服务器
app.use(session({
    resave:true,
    key: 'blog',//cookie name cookie 的名字
    cookie: {maxAge: 1000 * 60 * 60 * 24 * 30},//30 days
    saveUninitialized:true,
    secret:'blog',
    store:new MongoStore({
        db:settings.db,
        host:settings.host,
        port:settings.port
    })
}));
//基于session的零时存储，取了之后就销毁
app.use(flash());

app.use(function(req,res,next){
    //如果这个值是空的话会返回''
    res.locals.user = req.session.user;
    res.locals.success = req.flash('success').toString();
    res.locals.error = req.flash('error').toString();
    next();
});

// favicon.ico地址
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

//输出日志
var accessLog = fs.createWriteStream('access.log', {flags: 'a'});
var errorLog = fs.createWriteStream('error.log', {flags: 'a'});
app.use(logger('dev', {stream: accessLog}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/user', users);
app.use('/article', articles);

// 捕获404页面
app.use(function(req, res, next) {
    res.render('404', {
        title: 'error page'
    });
});

// error handlers
app.use(function (err, req, res, next) {
  var meta = '[' + new Date() + ']' + req.url + '\n';
  errorLog.write(meta + err.stack + '\n');
  next();
});

//开发环境，输出错误日志到页面
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
//  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
