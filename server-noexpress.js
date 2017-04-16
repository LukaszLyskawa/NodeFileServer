//
// Simple "native" HTTP REST
//
var http = require('http');
var path = require('path');

var server = http.createServer(function(req,res){
	// console.log("HEADERS"+req.headers);
	// console.log("METHOD"+req.method);
	// console.log("URL:"+req.url);
	var url = {ref: path.normalize(req.url)};
	call(url, req,res);
	res.end("kek");
}).listen(4000,function(){
	var addr = server.address();
	console.log("Server listening at", addr.address + ":" + addr.port);
});


//FAKE DATA
var list=[{id: 0, name:"feels-1492362580289.png", download: "/uploads/feels-1492362580289.png", version:"3.1.1",dateAdded:"16.04.2017 19:43"}];
//*************



//BASE
var baseFunctions = new Map([
 	["file", function (url,req,res){
		//handle methods
		switch(req.method){
			case "GET":{
				var handled = call(url, req, res);
				if(handled == UNHANDLED){
					res.end(JSON.stringify(list));
				}
				break;
			}
		}
	}]
	]);


//Library?

var HANDLED=true;
var UNHANDLED=false;
var SKIP=3;
function call(url, req, res){
	var safeurl=path.parse(req.url);
	if(safeurl.ext!=""){
		return SKIP;
	}
	var functionName = parseUrl(url);
	if(functionName==null || !baseFunctions.has(functionName)){
		return UNHANDLED;
	}
	baseFunctions.get(functionName)(url,req,res);
	return HANDLED;
}


function parseUrl(url){
	//remove \ from the start
	url.ref = url.ref.replace(/^\\/,'');
	var func = url.ref.substring(0,url.ref.indexOf("\\"));
	url.ref = url.ref.slice(func.length);
	return func;
}



