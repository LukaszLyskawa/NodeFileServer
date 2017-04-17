const restify = require('restify'),
multer = require('multer'),
path = require('path'),
fs = require('fs');


//INIT

const SERVER_IP = "dev.lyskawa.pl";
const SERVER_PORT = 3000;
const SERVER_URL = `http://${SERVER_IP}:${SERVER_PORT}`;
const UPLOAD_PATH = "uploads";
const UPLOAD_DIR = `${__dirname}\\{$UPLOAD_PATH}`;

const server = restify.createServer();

const storage = multer.diskStorage({
	destination: function(req, file, cb){
		cb(null, `${UPLOAD_PATH}/`);
	},
	filename: function(req, file, cb){
		var filename = path.parse(file.originalname);
		cb(null, filename.name + '-' + Date.now() + filename.ext);
	}
});
const upload = multer({storage: storage});
//FAKE DATA
var list=[{id: 0, name:"feels-1492362580289.png", download: "/uploads/feels-1492362580289.png", version:"3.1.1",dateAdded:"16.04.2017 19:43"}];
//*************


//BEHAVIOUR

server.get('/file',function(req,res){
  //LIST FILES
  var response=[];
  fs.readdir(UPLOAD_PATH,function(err,items){
  	for(var i=0,size=items.length;i<size;i++){
  		var stats = fs.statSync(`${UPLOAD_PATH}\\${items[i]}`);
  		response.push({id: i, name: items[i], download: `${SERVER_URL}/${UPLOAD_PATH}/${items[i]}`, dateAdded: stats.birthtime, size: stats.size});
  	}
  	res.json(response);
  });
});


  server.get('/file/:id',function(req,res){
  	res.json(list[req.params.id]);
  });

  server.post('/file', upload.single('img'), function (req, res, next) {
  	res.end(req.file.filename);
  });

  server.get(/\/uploads\/?.*/, restify.serveStatic({
  	directory: __dirname
  }));

  server.listen(SERVER_PORT,function(){
  	console.log('%s listening at %s',server.name,SERVER_URL) 
  });
