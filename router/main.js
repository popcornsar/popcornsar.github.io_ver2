
var express = require('express');
var router = express.Router();
var geoip = require('geoip-lite'); // 접속국가 추적
// var useragent= require('useragent');
// useragent(true);

var language = require('../libs/language'); // 다국어 설정 모듈


router.get('/', function(req, res){
    console.log('home 접속');

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
    
    res.render('section', { language : language(req) } );
});


router.post('/languageChange', function(req,res){
    console.log('/languageChange 라우터 호출');
    console.log('변경하는 언어==>', req.body.language);
    req.session.country =  req.body.language;
    res.json({message : "success"});
});


router.get('/404',function(req,res){
    // console.log(jp);
    res.render('404', {language : language(req) } );
});



module.exports = router;