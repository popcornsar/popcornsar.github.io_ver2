
var express = require('express');
var router = express.Router();
var geoip = require('geoip-lite'); // 접속국가 추적

var language = require('../libs/language'); // 다국어 설정 모듈
var UserInfoModel = require('../models/UserInfoModel');

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




router.get('/download/:filename', function(req,res){

    console.log('/download/:filename 라우터');
    
    var path = 'download/:filename';
    var filename=req.params.filename; // 각각의 파일을 구분하는 파일 ID값
    console.log("파일이름"+filename);
    var filepath = "./upload-folder/"+filename;
    

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
    var headerData = req.headers;
    console.log('geo정보==>',geo);
    console.log("header의 정보==>",headerData);

    var UserInfoData = new UserInfoModel({
        user_ip : ip,
        user_location : geo,
        userConnect_path : path,
        downloadFile_name : filepath,
        header_data : headerData
    });
    UserInfoData.save(function(err){
       
        if (err) {
            console.log("데이터 저장중 error 발생 ==>",err);
        }
        console.log("data 저장");
        
        res.download(filepath,filename,function(err){
            console.log(err);
        });
    });


});



module.exports = router;