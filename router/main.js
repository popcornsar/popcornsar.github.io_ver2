module.exports = function(app)
{
     app.get('/',function(req,res){
        res.render('main_kr.html')
     });
    app.get('/main_en',function(req,res){
        res.render('main_en.html')
     });
    app.get('/main_jp',function(req,res){
        res.render('main_jp.html')
     });
}