//MODULES
var http = require("http");
var qs = require("querystring")
var hserver = http.createServer(handleRequest);
var dns = require("dns");
var fs = require("fs");
var ws = require("ws");
var os = require("os");
var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({ port: 8181 });

wss.on('connection', function connection(ws) {
    ws_array.push(ws);
    ws.on('message', function(message) {
        messageRecived(ws,message);
        console.log("RECIVED:"+message);
    });
    ws.on("ready",function(){
        ws.send(JSON.stringify(initInstance()));
    });
});

//CLASSES
var c = require("./class/class.js");

//VARS
var orderable_id = 0;
var table_id = 0;
var extra_id = 0;
var pending_id = 0;

//LISTS
var orderable = [];
var tables = [];
var extras = [];
var pending = [];

var ws_array = [];

//CONST
const port = 8080;
const apikey = "api";

//FUNCTIONS
function getOrderableId(){orderable_id++;return orderable_id.toString(36);}
function getTableId(){table_id++;return table_id.toString(36);}
function getExtraId(){extra_id++;return extra_id.toString(36);}
function getPensingd(){pending_id++;return pending_id.toString(36);}

function errorJSON(st){return JSON.stringify({error:st});}

function parseFormData(data)
{
    var arr = data.split("\r\n");
    var delimiter = arr.shift();
    var d = {}, t;
    var p = "";
    while(arr.length>0)
    {
        t = arr.shift();
        if(t.indexOf(delimiter+"--")==0)
        {
            break;
        }
        else if(t.indexOf(delimiter)==0){
            continue;
        }
        else if(t.search(/content\-disposition: form.data/i)==0)
        {
            p = t.split(" ").pop().replace(/(^name=\"|\"$)/gi,"");
        }
        else if(t.length==0)
        {
            t = arr.shift();
            d[p]=t;
        }
    }
    return d;
}

function postHandle(req,cb)
{
    cb = cb || function(){};
    var data = "";
    req.on("data",function(d){
        data+=d;
        if (data.length > 1e6) {req.connection.destroy();}
    });
    req.on("end",function(){
        var o = parseFormData(data);
        cb(o);
    });
}

function broadcast(msg)
{
    for(var i = ws_array.length; --i>=0;)
    {
        if(ws_array[i].readyState==ws_array[i].OPEN)
        {
            try{
                ws_array[i].send(msg);
            }catch(e){}
        }
    }
}

function messageRecived(ws,message)
{
    
}

function initInstance()
{
    return {
        orderable:orderable,
        tables: tables,
        extras: extras,
        queue: pending
    };
};

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
    "info":function(m,req,res){
        var o = {};
        o.webPort = port;
        o.socketPort = 8181;
        o.apiPrefix = apikey;
        o.hostname = os.hostname();
        dns.lookup(o.hostname,function(err,address){
            if(!!err)
            {
                o.address=false;
                o.links=[];
                res.end(JSON.stringify(o));
                return;
            }
            o.address=address;
            dns.reverse(address,function(err,names){
                o.links=names;
                res.end(JSON.stringify(o));
            });
        });
        return false;
    },
    "queue":function(m,req,res)
    {
        if(m=="post")
        {
            postHandle(req,function(o){
                req.end(errorJSON("Has to be implemented"));
            });
            return false;
        }
        else return JSON.stringify(pending);
    },
    "addextra":function(m,req,res)
    {
        postHandle(req,function(o){
            try{
                var json = JSON.parse(o.data);
                var e = new Extra(getExtraId(),json.name,json.price);
                extras.push(e);
                res.end(JSON.stringify({added:e}));
                return;
            }catch(e){
                res.end("{\"error\":\"Invalid data format\"}");
                return;
            };
            res.end("Somthing strange happened");
        });
        return false;
    },
    "editextra":function(m,req,res)
    {
        postHandle(req,function(o){
            try{
                var json = JSON.parse(o.data);
                var e = new Extra(json.id,json.name,json.price);
                var found = false;
                for(var i = extras.length; --i>=0;)
                {
                    if(extras[i].id==e.id)
                    {
                        extras[i]=e;
                        found=true;
                        break;
                    }
                }
                if(found)
                    res.end(JSON.stringify({modified:e}));
                else
                    res.end(errorJSON("Extra not found"));
                return;
            }catch(e){
                res.end("{\"error\":\"Invalid data format\"}");
                return;
            };
            res.end("Somthing strange happened");
        });
        return false;
    },
    "delextra":function(m,req,res)
    {
        postHandle(req,function(o){

            try{
                var deleted = false;
                for(var i = extras.length; --i>=0;)
                {
                    if(extras[i].id==o.id)
                    {
                        extras.splice(i,1)
                        deleted=true;
                        break;
                    }
                }
                if(deleted)
                    res.end(JSON.stringify({deleted:o.id}));
                else
                    res.end(errorJSON("Extra not found"));
                return;
            }catch(e){
                res.end("{\"error\":\"Invalid data format\"}");
                return;
            };
            res.end("Somthing strange happened");
        });
        return false;
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

