var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var con = mongoose.createConnection('mongodb://localhost/blog', function () {
//    console.log('mongo link success');
});

var User = con.model('User', new Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    email: {type: String, required: true},
    avatar: {type: String, required: true}
}));

var Article = con.model('Article', new Schema({
    user: {type: ObjectId, ref: 'User'},
    title: String,
    content: String,
    createAt: {type: Date, default: Date.now()},
    img: String,
    comments: [{user: {type: ObjectId, ref: 'User'}, content: String, createAt: {type: Date, default: Date.now}}],
    pv: {type:Number,default:0}
}));


global.M = function (modelname) {
    return con.model(modelname);
};

