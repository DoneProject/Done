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
  console.log("OPENING CONNECTION");
  ws_array.push(ws);
  ws.on('message', function(message) {
    console.log("RECIVED:"+message);
    messageRecived(ws,message);
  });
  ws.on("ready",function(){
    console.log("READY");
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

var running = false;
var password = "";
var earned = 0;
var orders = 0;

//LISTS
var orderable = [];
var tables = [];
var extras = [];
var pending = [];
var concluded = [];

var ws_array = [];

//CONST
const port = 8080;
const apikey = "api";

//Interfaces
var wsaction = {
  "statsUpdate":function()
  {
    sendEvent("statsUpdate",getStats());
  },
  "delextra":function(id)
  {
    sendEvent("delExtra",id);
  },
  "addextra":function(e){
    sendEvent("addExtra",e);
  },
  "editextra":function(e){
    sendEvent("editExtra",e);
  },
  "delproduct":function(id)
  {
    sendEvent("delProduct",id);
  },
  "addproduct":function(e){
    sendEvent("addProduct",e);
  },
  "editproduct":function(e){
    sendEvent("editProduct",e);
  },
  "sendorderlist":function(e){
    sendEvent("updateOrderlist",e);
  },
  "addorderlist":function(e){
    sendEvent("addOrderlist",e)
  },
  "orderable":function(e){
    sendEvent("orderableUpdate",e);
  }
}

//FUNCTIONS
function getOrderableId(){orderable_id++;return orderable_id.toString(36);}
function getTableId(){table_id++;return table_id.toString(36);}
function getExtraId(){extra_id++;return extra_id.toString(36);}
function getPendingId(){pending_id++;return pending_id.toString(36);}
function wsBroadcast(st)
{
  for(var i = ws_array.length; --i>=0;)
  {
    try{
      ws_array[i].send(st);
    }catch(e){}
  }
}
function wsBroadcastObject(obj)
{
  wsBroadcast(JSON.stringify(obj));
}

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

function getStats()
{
  return {
    password:password,
    products:orderable.length,
    extras:extras.length,
    tables:tables.length,
    earned:earned,
    orders:{
      active:pending.length,
      total:orders
    }
  }
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

function sendEvent(eventName,data)
{
  broadcast(JSON.stringify({
    "action":"event",
    "event":eventName,
    "data":data
  }));
}

function sendEventTo(ws,eventName,data){
  ws.send(JSON.stringify({
    action:"event",
    "event":eventName,
    "data":data
  }))
}

function updateOrderList(o)
{
  for(var i = pending.length; --i>=0;)
  {
    if(o.id==pending[i].id)
    { 
      pending[i].orders=o.orders;
      api.updateOneOrderlist(pending[i]);
    }
  }
}

function messageRecived(ws,message)
{
  var j = JSON.parse(message);
  if("get" in j)
  {
    switch(j.get)
    {
      case "tables":
        sendEventTo(ws,"updateTablecount",{
          action:"settables",
          tables:tables,
          count:tables.length
        });
        break;
      case "orderable":
        sendEventTo(ws,"orderableUpdate",orderable);
        break;
      case "extras":
        sendEventTo(ws,"extras",extras);
        break;
      case "queue":
        ws.send(JSON.stringify(pending));
        break;
      case "info":
        serverInfo(function(o){
          ws.send(JSON.stringify(o));
        });
        break;
      case "stats":
        wsaction.statsUpdate();
        break;
      case "orderlist":
        sendEventTo(ws,"updateOrderlist",orders)
        break;
      default:
        ws.send(errorJSON("Wrong action"));
        break;
    }
  }
  else if("post" in j && "data" in j)
  {
    var d = j.data, mask;
    switch(j.post)
    {
      case "orderlist":
        for(var i = d.length; --i>=0;)
        {
          if(!("tableId") in d[i])continue;
          if(mask=OrderList.valid(d[i]) > 0)
          {
            switch(mask)
            {
              case OrderList.VALID:
                updateOrderList(d[i])
                break;
              default:
                var o = new OrderList(getPendingId());
                o.state="pending";
                o.orders=d[i].orders;
                pending.push(o);
                api.addorderlist(o);
                break;
            }
          }
        }
        break;
      case "extra":
        if((mask = Extra.valid(d)) > 0)
        {
          switch(mask){
            case Extra.VALID:
              updateExtra(d);
              break;
            default:
              var e = new Extra(getExtraId());
              e.name=d.name;
              e.price=d.price;
              extras.push(e);
              api.addextra(e);
              break;
          }
        }
        break;
      case "done":
        
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

function enumTables()
{
  var t = [];
  for(var i = 0; i < tables.length;i++)
  {
    t.push(tables[i].setNR(i+1)); 
  }
  return t;
}

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
        wsaction.addextra(e);
        wsaction.statsUpdate();
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
        {
          wsaction.editextra(e);
          res.end(JSON.stringify({modified:e}));
        }
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
        {
          wsaction.delextra(o.id);
          wsaction.statsUpdate();
          res.end(JSON.stringify({deleted:o.id}));
        }
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
        var e = new Order(getOrderableId(),json.name,[],json.price);
        orderable.push(e);
        wsaction.addproduct(e);
        wsaction.statsUpdate();
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
        var e = new Order(json.id,json.name,[],json.price);
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
        {
          wsaction.editproduct(e);
          res.end(JSON.stringify({modified:e}));
        }
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
        for(var i = orderable.length; --i>=0;)
        {
          if(orderable[i].id==o.id)
          {
            orderable.splice(i,1);
            deleted=true;
            break;
          }
        }
        if(deleted)
        {
          wsaction.delproduct(o.id);
          wsaction.statsUpdate();
          res.end(JSON.stringify({deleted:o.id}));
        }
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
  "settablecount":function(m,req,res){
    postHandle(req,function(o){
      console.log(o);
      try{
        var c = parseInt(o.number);
        if(isNaN(c))res.end("{\"error\":\"Param is not a number\"}");

        if(!!tables)
        {
          if(c < tables.length)
          {
            tables.splice(c);
          }
          else if(c > tables.length)
          {
            var dif = c-tables.length;
            for(var i = dif; --i>=0;)
            {
              console.log("TABLE COUNT:"+i);
              tables.push(new Table(getTableId()));
            }
            console.log("END");
          }
          var table = enumTables();
          var t = {action:"settables",tables:tables,count:tables.length};
          sendEvent("updateTablecount",t);
          wsaction.statsUpdate();
          res.end(JSON.stringify(t));
        }
        return;
      }catch(e){
        res.end("{\"error\":\"Invalid data format\"}");
        console.log("ERROR:",e.message);
        return;
      };
      res.end("Somthing strange happened");
    });
    return false;
  },
  "startexecution":function(m,req,res)
  {
    postHandle(req,function(o){
      if(o.password.length<=1 || o.password==undefined)
      {
        password=false;
      }
      else
      {
        password=o.password;
      }
      res.end(JSON.stringify({password:password,tables:tables}));
      wsaction.statsUpdate();
      running=true;
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

function save()
{
  var t = os.tmpdir();
  fs.writeFile(t+"/table.json",JSON.stringify(tables),"utf8");
  fs.writeFile(t+"/products.json",JSON.stringify(orderable),"utf8");
  fs.writeFile(t+"/extras.json",JSON.stringify(extras),"utf8");
  fs.writeFile(t+"/status.json",JSON.stringify(getStats()),"utf8");
  fs.writeFile(t+"/pending.json",JSON.stringify(pending),"utf8");
  fs.writeFile(t+"/concluded.json",JSON.stringify(concluded),"utf8");
  console.log("TEMP DIR: "+t);
}

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

console.log("TEMP DIR: "+os.tmpdir())