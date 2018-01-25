
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');
var UserInfoSchema = new Schema({
    user_ip : { 
        type : String,
        default : '11',
        required : true
    },
    user_location : { // 접속국가
        type : Object,
        default : '22',
    },
    clicked_at : {  // 시간
        type : Date,
        default : Date.now(),
        required : true
    },
    userConnect_path : { // 접속한 페이진
        type : String,
        required : true
    },
    downloadFile_name :{ // 다운로드 페이지 접속시 다운받은 파일 이름
        type : String,
        required : false
    },
    // header 정보
    header_data : {
        type : Object,
        required : true
    }
});

UserInfoSchema.virtual('getDate').get(function() {
    var date = new Date(this.created_at);
    return {
        year : date.getFullYear(),
        month : date.getMonth()+1,
        day : date.getDate()
    };
});

UserInfoSchema.plugin( autoIncrement.plugin , {model : "userInfo", field : "id", startAt : 1} );
module.exports = mongoose.model('userInfo', UserInfoSchema);

