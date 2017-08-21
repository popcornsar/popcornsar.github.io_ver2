var express = require('express');
var app = express();
var router = require('./router/main')(app);

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

var server = app.listen(80, function(){
    console.log("Express server has started on port 80")
});
app.use(express.static('public'));
app.use(express.static('vendor'));
app.use(express.static('img'));
app.use(express.static('js'));