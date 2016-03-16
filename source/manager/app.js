//MODULES
var http = require("http");
var hserver = http.createServer(handleRequest);
var dns = require("dns");
var fs = require("fs");
var ws = require("ws");
var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({ port: 3000 });

wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        console.log("");
    });
    ws.send('something');
});

//CLASSES
var c = require("./class/class.js");

//LISTS
var orderable = [];
var tables = [];
var extras = [];
var pending = [];

//CONST
const port = 8080;
const apikey = "api";

//API Handlers
var api_handlers = {
  "tables":function()
  {
    return JSON.stringify(tables);
  },
  "orderable":function()
  {
    return JSON.stringify(orderable);
  },
  "extras":function()
  {
    return JSON.stringify(extras);
  },
  "queue":function(m,req,res)
  {
    if(m=="post")
    {
      var data = "";
      req.on("data",function(d){data+=d;})
      req.on("end",function(){
        try{
          var json = JSON.parse(data);
          pending.push(json);
          res.end(JSON.stringify(pending));
          return;
        }catch(e){
          res.end("{\"Error\":\"Invalid data format\"}");
          return;
        };
        res.end("Somthing strange happened");
      })
    }
    else return JSON.stringify(pending);
  }
};

//Constructor
function handleApiRequest(request,response)
{
  var r = request.url.replace(new RegExp("^\/?"+apikey+"\/?"),"");
  var m = request.method.toLowerCase();
  if(r in api_handlers)
  {
    var t = api_handlers[r](m,request,response);
    if(t!==false)
      response.end(t);
  }
  else
  {
    response.end("API not found.");
  }
};

function handleRequest(request,response)
{
  console.log("REQUEST: "+new Date());
    console.log(request.headers);
  if(request.url.indexOf("/"+apikey)==0)
  {
    handleApiRequest(request,response);
    return;
  }
  
  if(request.url=="/" || request.url.length==0)request.url="index.html";
  if(request.url[0]=="/")request.url=request.url.replace("/","");
  
  try{
    var resp = fs.readFileSync(request.url);
    response.end(resp);
  }catch(e){
    response.end("ERROR: location "+request.url);
  }
  
};


hserver.listen(port,function(){
  console.log("Server listening on: http://localhost:%s", port);
});

