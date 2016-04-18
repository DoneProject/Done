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

wss.on('connection', function connection(ws)
       {
  ws_array.push(ws);
  ws.on('message', function(message) {
    messageRecived(ws,message);
  });
  ws.on("ready",function(){
    ws.send(JSON.stringify(initInstance()));
  });
});

//CLASSES
require("./class/class.js");

//VARS
var orderable_id = 0;
var table_id = 0;
var extra_id = 0;
var pending_id = 0;
var user_id=0;

var running = false;
var password = "";
var earned = 0;
var orders = 0;

var tmpdir = null;
tmpdir=os.tmpdir()+"/DONE/";
try {fs.mkdirSync(tmpdir,0o777);  } catch (e) {}

//LISTS
var orderable = [];
var tables = [];
var extras = [];
var pending = [];
var concluded = [];
var users = [];

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
    wsaction.log("Deleting extra "+id);
    sendEvent("delExtra",id);
  },
  "addextra":function(e){
    wsaction.log("Added extra "+Blockify(e));
    sendEvent("addExtra",e);
  },
  "editextra":function(e){
    wsaction.log("Edited extra "+Blockify(e));
    sendEvent("editExtra",e);
  },
  "delproduct":function(id)
  {
    wsaction.log("Deleted extra "+Blockify(e));
    sendEvent("delProduct",id);
  },
  "addproduct":function(e){
    wsaction.log("Added product "+Blockify(e));
    sendEvent("addProduct",e);
  },
  "editproduct":function(e){
    wsaction.log("Edited product "+Blockify(e));
    sendEvent("editProduct",e);
  },
  "sendorderlist":function(e){
    wsaction.log("Orderlist broadcasted");
    sendEvent("updateOrderlist",e);
  },
  "addorderlist":function(e){
    wsaction.log("new order added "+Blockify(e));
    sendEvent("addOrderlist",e)
  },
  "orderable":function(e){
    wsaction.log("List of products broadcasted");
    sendEvent("orderableUpdate",e);
  },
  "editUser":function(e){
    wsaction.log("User edited"+Blockify(e));
    sendEvent("editUser",e);
  },
  "addUser":function(e){
    wsaction.log("User added"+Blockify(e));
    wsaction.statsUpdate();
    sendEvent("addUser",e);
  },
  "delUser":function(id){
    wsaction.log("User removed"+id);
    wsaction.statsUpdate();
    sendEvent("delUser",id);
  },
  "log":function(msg){
    sendEvent("addLog",{
      time:new Date(),
      message:msg
    });
  }
}

//FUNCTIONS
function getOrderableId(){orderable_id++;return orderable_id.toString(36);}
function getTableId(){table_id++;return table_id.toString(36);}
function getExtraId(){extra_id++;return extra_id.toString(36);}
function getPendingId(){pending_id++;return pending_id.toString(36);}
function getUserId(){user_id++;return user_id.toString(36);}
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

function Blockify(e,sub)
{
  var t = "<div class=\""+(sub==true ? "sub_" : "")+"blockify\">";
  for(var lol in e)
  {
    if(e[lol]===null || typeof e[lol]=="function")continue;
    t+="<div class=\"blocky_row\"><strong class=\"blocky_key\">"+lol+"</strong>";
    if(typeof e[lol] == "string" || typeof e[lol] =="number" || typeof e[lol] =="boolean")
    {
      t+="<span class=\"blocky_value\">"+e[lol]+"</span>";
    }
    else if(typeof e[lol] == "object")
    {
      t+=Blockify(e[lol],true);
    }
    else{
      t+="<span class=\"blocky_value unknown\">unknown</span>";
    }
    t+="</div>";
  }
  t+="</div>";
  return t;
}

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
    users:users.length,
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
        sendEventTo(ws,"extrasUpdate",extras);
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
      case "users":
        sendEventTo(ws,"usersUpdate",users);
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
        save();
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
        save();
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
        save();
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
          save();
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
          save();
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
        save();
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
          save();
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
          save();
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
          save();
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
      save();
      running=true;
    });
    return false;
  },
  "edituser":function(m,req,res)
  {
    postHandle(req,function(o){
      if(!("username" in o)){
        res.end(errorJSON("No username defined"));
        return;
      }
      var hasID = ("id" in o);
      if(hasID)
      {
        for(var i = users.length;--i>=0;){
          if(users[i].id==o.id)
          {
            users[i].username=o.username;
            users[i].setRole(o.role);
            wsaction.editUser(users[i]);
            save();
            res.end(JSON.stringify(users[i]))
            return;
          }
        }
      }
      var u = new User(getUserId(),o.username);
      u.setRole(o.role);
      users.push(u);
      wsaction.addUser(u);
      save();
      res.end(JSON.stringify(u));
    });
    return false;
  },
  "deluser":function(m,req,res){
    postHandle(req,function(id){
      if(!("id" in id)){
        res.end(errorJSON("No id specidifed"));
        return;
      }
      id=id.id;
      for(var i = users.length; --i>=0;)
      {
        if(users[i].id==id)
        {
          console.log("USER FOUND");
          users.splice(i,1);
          wsaction.delUser(id);
          res.end('{"deleted":"'+id+'"}');
          save();
          return;
        }
      }
      res.end(errorJSON("Did not find ID"));
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
  var t = os.tmpdir()+"/DONE";
  fs.writeFile(t+"/table.json",JSON.stringify(tables),"utf8");
  fs.writeFile(t+"/products.json",JSON.stringify(orderable),"utf8");
  fs.writeFile(t+"/extras.json",JSON.stringify(extras),"utf8");
  fs.writeFile(t+"/status.json",JSON.stringify(getStats()),"utf8");
  fs.writeFile(t+"/pending.json",JSON.stringify(pending),"utf8");
  fs.writeFile(t+"/concluded.json",JSON.stringify(concluded),"utf8");
  fs.writeFile(t+"/users.json",JSON.stringify(users),"utf8");
  fs.writeFile(t+"/0_IMPORTANT_README.md","#DO NOT DELETE, EDIT OR ADD ANY FILE OR DATA TO THIS DIRECTORY\n\n#LÖSCHEN SIE KEIN FILE (ODER DATEN) IN DIESEM ORDNER, EBENFALLS NICHTS VERÄNDERN ODER HINZUFÜGEN.\n\n#NON MODIFICARE, AGGIUNGERE O CANCELLARE FILE O DATI IN QUESTA CARTELLA!","utf8");
    fs.writeFile(t+"/0_IMPORTANT_README.txt","DO NOT DELETE, EDIT OR ADD ANY FILE OR DATA TO THIS DIRECTORY\n\nLÖSCHEN SIE KEIN FILE (ODER DATEN) IN DIESEM ORDNER, EBENFALLS NICHTS VERÄNDERN ODER HINZUFÜGEN.\n\nNON MODIFICARE, AGGIUNGERE O CANCELLARE FILE O DATI IN QUESTA CARTELLA!","utf8");
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
    wsaction.log("Server is ready");
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
console.log("TEMP DIR: "+tmpdir);

function importFiles(root){
  function ifExists(p,asjson){
    try{
      if(asjson === undefined)asjson=true;
      var s = fs.statSync(p);
      if(s.isFile()){
        var con = fs.readFileSync(p,"utf8");
        if(asjson)con=JSON.parse(con);
        return function(fx){fx(con);}
      }
      else return function(){}
    }catch(e){
      return function(){}
    }
  }

  function maxId(arr,prop,radix)
  {
    if(radix===undefined)radix=10;
    var m = [];
    arr.forEach(function(ele){
      m.push(parseInt(""+ele[prop],radix));
    });
    if(m.length==0)return 0;
    return Math.max.apply(this,m);
  }

  ifExists(root+"/concluded.json")(function(json){
    concluded=json;
  });
  ifExists(root+"/extras.json")(function(json){
    extras=json;
    extra_id=maxId(extras,"id",36);
  });
  ifExists(root+"/products.json")(function(json){
    orderable=json;
    orderable_id=maxId(orderable,"id",36);
  });
  ifExists(root+"/pending.json")(function(json){
    pending=json;
    pending_id=maxId(orderable,"id",36);
  });
  ifExists(root+"/status.json")(function(json){
  earned = json.earned;
  orders = json.orders.total;
  });
  ifExists(root+"/table.json")(function(json){
    tables=json;
    table_id=maxId(tables,"id",36);
  });
  ifExists(root+"/users.json")(function(json){
    users=json;
    user_id=maxId(users,"id",36)
  });
}
importFiles(tmpdir);
