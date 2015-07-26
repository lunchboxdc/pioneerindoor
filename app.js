var express = require("express");
var app = express();
var path = require("path");

app.set('port', process.env.OPENSHIFT_NODEJS_PORT || 3000);
app.use(express.static('assets'));

app.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/index.html'));
});

app.listen(app.get('port'), process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1', function() {
  console.log('Express server listening on port ' + app.get('port'));
});
