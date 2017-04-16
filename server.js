//
// # Simple file server
//
//
var http = require('http'),
path = require('path'),
express = require('express'),
multer = require('multer');

var storage = multer.diskStorage({
	destination: function(req, file, cb){
		cb(null, "uploads/");
	},
	filename: function(req, file, cb){
		var filename = path.parse(file.originalname);
		cb(null, filename.name + '-' + Date.now() + filename.ext);
	}
});
var upload = multer({storage: storage});

var app = express();
var server = http.createServer(app);
app.use(express.static(path.resolve(__dirname, 'client')));




//FAKE DATA
var list=[{id: 0, name:"feels-1492362580289.png", download: "/uploads/feels-1492362580289.png", version:"3.1.1",dateAdded:"16.04.2017 19:43"}];
//*************

server.listen(3000, function(){
  var addr = server.address();
  console.log("Server listening at", addr.address + ":" + addr.port);
});


app.get('/file',function(req,res){
  //LIST FILES
  res.json(list);
});

app.get('/file/:id',function(req,res){
  res.json(list[req.params.id]);
});

app.post('/file/upload', upload.single('img'), function (req, res, next) {
  res.end(req.file.filename);
});