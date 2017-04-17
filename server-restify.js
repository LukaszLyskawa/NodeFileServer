const restify = require('restify'),
multer = require('multer'),
path = require('path'),
fs = require('fs');


//INIT

const SERVER_IP = "dev.lyskawa.pl";
const SERVER_PORT = 3000;
const SERVER_URL = `http://${SERVER_IP}:${SERVER_PORT}`;
const UPLOAD_PATH = "uploads";

const server = restify.createServer();

const upload = multer({storage: multer.diskStorage({
	destination: function(req, file, cb){
		cb(null, `${UPLOAD_PATH}/`);
	},
	filename: function(req, file, cb){
		var filename = path.parse(file.originalname);
		cb(null, filename.name + '-' + Date.now() + filename.ext);
	}
})
});

//LIST FILES
server.get('/file',function(req,res){
  var response=[];
  fs.readdir(UPLOAD_PATH,function(err,items){
  	for(var i=0,size=items.length;i<size;i++){
  		var stats = fs.statSync(`${UPLOAD_PATH}\\${items[i]}`);
  		response.push({id: i, name: items[i], download: `${SERVER_URL}/${UPLOAD_PATH}/${items[i]}`, dateAdded: stats.birthtime, size: stats.size});
  	}
  	res.json(response);
  });
});

//GET FILE[ID]
server.get('/file/:id',function(req,res){
	var id = req.params.id;
	fs.readdir(UPLOAD_PATH,function(err,items){
		var stats = fs.statSync(`${UPLOAD_PATH}\\${items[id]}`);
		res.json({id: id, name: items[id], download: `${SERVER_URL}/${UPLOAD_PATH}/${items[id]}`, dateAdded: new Date(stats.birthtime).toUTCString(), sizeB: stats.size});
	});
});

//UPLOAD IMAGE
server.post('/file', upload.single('img'), function (req, res, next) {
	res.end(req.file.filename);
});

//DOWNLOAD IMAGE
server.get(/\/uploads\/?.*/, restify.serveStatic({
	directory: __dirname
}));



server.listen(SERVER_PORT,function(){
	console.log('%s listening at %s',server.name,SERVER_URL) 
});
