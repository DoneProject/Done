//MODULES
var http = require("http");
var qs = require("querystring")
var hserver = http.createServer(handleRequest);
var dns = require("dns");
var fs = require("fs");
var ws = require("ws");
var os = require("os");
var opener = require("opener");
var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({ port: 8181 });

wss.on('connection', function connection(ws) {
    ws_array.push(ws);
    ws.on('message', function(message) {
        messageRecived(ws,message);
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
function getPendingId(){pending_id++;return pending_id.toString(36);}

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
    console.log("NUMBER OF CLIENTS: "+ws_array.length);
    for(var i = ws_array.length; --i>=0;)
    {
        if(ws_array[i].readyState==ws_array[i].OPEN)
        {
            console.log("SEND TO CLIENT "+i);
            try{
                ws_array[i].send(msg);
            }catch(e){}
        }
    }
}

function sendEvent(eventName,eventAction,data)
{
    broadcast(JSON.stringify({
        "act":"event",
        "event":eventName,
        "action":eventAction||null,
        "data":data
    }));
}

function messageRecived(ws,message)
{
    var j = JSON.parse(message);
    if("get" in j)
    {
        switch(j.get)
        {
            case "tables":
                ws.send(JSON.stringify(tables));
                break;
            case "orderable":
                ws.send(JSON.stringify(orderable));
                break;
            case "extras":
                ws.send(JSON.stringify(extras));
                break;
            case "queue":
                ws.send(JSON.stringify(pending));
                break;
            case "info":
                serverInfo(function(o){
                    ws.send(JSON.stringify(o));
                });
                break;
            case "tables":
                ws.send(JSON.stringify(tables));
                break;
            default:
                ws.send(errorJSON("Wrong action"));
                break;
        }
    }
}

function serverInfo(cb)
{
    cb = cb || function(){};
    var o = {};
    o.webPort = port;
    o.socketPort = 8181;
    o.apiPrefix = apikey;
    o.hostname = os.hostname();
    o.links=[];
    o.address="127.0.0.1";
    dns.lookup(o.hostname,function(err,address){
        if(!!err)
        {
            o.address=false;
            o.links=[];
            cb(o);
            return;
        }
        o.address=address; 
        dns.reverse(address,function(err,names){
            if(!err)
                o.links=names;
            cb(o);
        });
    });
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
    "orderid":function()
    {
        return JSON.stringify({"offer":getPendingId()})
    },
    "info":function(m,req,res){
        serverInfo(function(o){
            res.end(JSON.stringify(o));
        });
        return false;
    },
    "queue":function(m,req,res){
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
    },
    "addproduct":function(m,req,res)
    {
        postHandle(req,function(o){
            try{
                var json = JSON.parse(o.data);
                console.log(json);
                var e = new Order(null,getOrderableId(),json.name,[],json.price);
                orderable.push(e);
                res.end(JSON.stringify({added:e}));
                return;
            }catch(e){
                res.end("{\"error\":\""+e.message+"\"}");
                return;
            };
            res.end("Somthing strange happened");
        });
        return false;
    },
    "editproduct":function(m,req,res)
    {
        postHandle(req,function(o){
            try{
                var json = JSON.parse(o.data);
                var e = new Order(null,json.id,json.name,[],json.price);
                var found = false;
                for(var i = orderable.length; --i>=0;)
                {
                    if(orderable[i].prod_id==e.prod_id)
                    {
                        orderable[i]=e;
                        found=true;
                        break;
                    }
                }
                if(found)
                    res.end(JSON.stringify({modified:e}));
                else
                    res.end(errorJSON("Product not found"));
                return;
            }catch(e){
                res.end("{\"error\":\"Invalid data format\"}");
                return;
            };
            res.end("Somthing strange happened");
        });
        return false;
    },
    "delproduct":function(m,req,res)
    {
        postHandle(req,function(o){

            try{
                var deleted = false;
                for(var i = extras.length; --i>=0;)
                {
                    if(extras[i].id==o.id)
                    {
                        extras.splice(i,1);
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
        if(request.url.search(/\.svg$/i)!==-1)
        {
            response.writeHead(200,{
                'Content-Length': resp.length,
                'Content-Type': 'image/svg+xml'
            })
        }
        response.end(resp);
    }catch(e){
        response.end("ERROR: location "+request.url);
    }

};


function hinit()
{
    serverInfo(function(o){
        console.log(o);
        if(o.links.length>0)
        {
            console.log("URL: "+("http://"+o.links[0]+":"+o.webPort));
            opener("http://"+o.links[0]+":"+o.webPort);
        }
        else if(o.address.length>0)
        {
            console.log("URL: "+("http://"+o.address+":"+o.webPort));
            opener("http://"+o.address+":"+o.webPort);
        }
        else
        {
            console.log("URL: "+("http://127.0.0.1:"+o.webPort));
            opener("http://127.0.0.1:"+o.webPort);
        }
    });
}

try{
hserver.listen(port,hinit).error(function(m){console.log("ERROR");});
    hserver.on("error",function(){console.log("Connection Error");});
}catch(e)
{
    while(true)
    {
        port++;
        try{
            hserver.listen(port,hinit);
            break;
        }catch(e){continue;}
    }
}