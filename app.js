var express = require('express');
var path = require('path');
var i18n = require('i18n');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var flash = require('connect-flash'); //flash 메세지 관련
var session = require('express-session');

var geoip = require('geoip-lite'); // 접속국가 추적
var language = require('./libs/language'); // 다국어 설정 모듈
var config = require('./config/config');





//////////////////// mongoDB 접속//////////////////////
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var autoIncrement = require('mongoose-auto-increment');

var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function() {
    console.log('mongodb connect');
});

// fastcampus라는 db 생성, connect
var connect = mongoose.connect(config.db_url, { useMongoClient: true });
// primary key 자동 증가 플러그인 설정
autoIncrement.initialize(connect);





//////////////////// i18n 다국어 설정 //////////////////////
i18n.configure({
    locales : ['en', 'kr', 'jp'],
    directory : __dirname +'/locales',
    defaultLocale:'kr'
});


//////////////////// 라우터 호출 //////////////////////
var home = require('./router/main');

//////////////////// express 웹서버 호출 //////////////////////
var app = express();

//////////////////// view 엔진 (ejs) 세팅 //////////////////////
app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'ejs');


//////////////////// session 설정 //////////////////////
// var connectMongo = require('connect-mongo');
// var MongoStore = connectMongo(session);

var sessionMiddleWare = session({
    secret: 'autosar.io',
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 2000 * 60 * 60 //지속시간 2시간
    }
});



//////////////////// 미들웨어 등록//////////////////////
app.use('/public', express.static('public'));
app.use('/vendor', express.static('vendor'));
app.use('/js', express.static('js'));
// app.use('/upload-folder', express.static('upload-folder'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true }));
app.use(cookieParser());
app.use(i18n.init);
app.use(sessionMiddleWare); //session 추가
app.use(flash()); //플래시 메시지 관련

//////////////////// router 미들웨어 등록 //////////////////////
app.use('/', home);


//////////////////// 404미들웨어 등록 //////////////////////
app.use(function(req, res, next){ //404 error 처리 , 미들웨어 마지막에 둘것.
    var ip;
    if (req.headers['x-forwarded-for']) {
        ip = req.headers['x-forwarded-for'].split(",")[0];
    } else if (req.connection && req.connection.remoteAddress) {
        ip = req.connection.remoteAddress;
    } else {
        ip = req.ip;
    } console.log("client IP is *********************" + ip);

    var geo = geoip.lookup(ip);
    req.session.geo = geo;
    console.log('geo정보==>',geo);
    var geo = geoip.lookup(ip);
    req.session.geo = geo;
    console.log('geo정보==>',geo);
    
    res.status(404).render('error/404', { language: language(req)});
});

// var server = app.listen(3000, function(){ 
//     console.log("Express server has started on port 3000");
// });

module.exports = app;