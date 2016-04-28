serverInfo={};
password="";
ws = null;
//PH
updateStatusView = function(){};

//global
popups={};
tabledata={};

//EventHandlers
var ehandlers={
  addProduct:function(){
    console.log("addProduct not implemented");
  },
  addExtra:function(){
    console.log("addExtra not implemented");
  },
  editProduct:function(){
    console.log("editProduct not implemented");
  },
  editExtra:function(){
    console.log("editExtra not implemented");
  },
  delProduct:function(){
    console.log("delProduct not implemented");
  },
  delExtra:function(){
    console.log("delExtra not implemented");
  },
  updateTablecount:function(){
    console.log("updateTablecount not implemented");
  },
  updateTablecount2:function(){},
  statsUpdate:function(){
    console.log("statsUpdate not implemented");
  },
  orderableUpdate:function(asd){
    console.log("orderableUpdate not implemented");
  },
  extrasUpdate:function()
  {
    console.log("extrasUpdate not implemented");
  },
  usersUpdate:function(){
    console.log("usersUpdate not implemented");
  },
  addLog:function(){
    console.log("addLog not implemented");
  }
};


function sendEvent(name,element)
{
  element = element || document.body;
  try{
    var e = document.createEvent("Event");
    e.initEvent(name,true,true);
    element.dispatchEvent(e);
  }catch(err){
    var e = new Event(name);
    element.dispatchEvent(e);
  }
}

function aniprox(dur, fx) {
  if(!("requestAnimationFrame" in window)){
    requestAnimationFrame = mozAnimationFrame || oRequestAnimationFrame || webkitRequestAnimationFrame || msRequestAnimationFrame || function(fx){setTimeout(fx,16);}
  }
  var rap = function(i,v,x){return (v-i)/(x-i);}
  var start = new Date().getTime(), end = new Date(start + dur), now;
  var aframe = function()
  {
    var now = new Date().getTime(),r = rap(start,now,end);
    if(r >= 1){fx(1);return;}
    fx(r);
    requestAnimationFrame(aframe);
  };
  requestAnimationFrame(aframe);
}
Element.prototype.aniprox = function(dur,easing,concat){
  var xy = function(rap){
    return Math.pow(rap,1/1.5);
  }
  if(easing!==undefined && typeof easing == "string" && easing.length > 0)
  {
    switch(easing){
      case "linear":case "l":case "normal":
        xy = function(rap){return rap;}
        break;
      case "default":case "d":
        xy = function(rap){return rap;}
        break;
      case "sinus":case "sin":case "s":
        xy = function(rap){return Math.sin(rap*Math.PI/2);}
        break;
      case "quad":case "speedgain":case "sg":case "pow":
        xy = function(rap){return Math.pow(rap,2);}
        break;
      case "cool":case "aniprox":case "ap":case "powsin":
        xy = function(rap){return Math.pow(Math.sin(rap*Math.PI/2),2);}
        break;
      case "cool-i":case "aniprox-i":case "ap-i":case "powsin-i":
        xy = function(rap){return Math.pow(Math.sin(rap*Math.PI/2),1/2);}
        break;
      case "square":case "sqrt":case "squareroot":case "sr":
        xy = function(rap){return Math.sqrt(rap);}
        break;
    }
  }
  else if(easing!==undefined && typeof easing == "function" && "apply" in easing)
  {
    xy = easing;
  }
  var ele = this;
  var styles = getComputedStyle(ele);
  styles.scrollTop = ele.scrollTop;
  var changeObjects = {concat:concat}, lol;
  var changes = {};
  var anis = [];
  var anitypes={
    size:0,
    ratio:1,
    numeric:2
  };
  var unit = "";
  var up = function(rap){
    for(lol in changeObjects)
    {
      if(lol in styles && !(lol in changes))
      {
        var t = anitypes.size;
        if(lol == "opacity")
        {
          t = anitypes.ratio;
        }
        if(lol == "scrollTop")
        {
          t = anitypes.numeric;
          var v = changeObjects[lol];
          if(v == "bottom" || v=="end")
          {
            changeObjects[lol]=ele.scrollHeight-ele.offsetHeight;
          }
          else if(v == "top" || v=="start")
          {
            changeObjects[lol]=0;
          }
          else if(v == "mid" || v=="middle")
          {
            changeObjects[lol]=(ele.scrollHeight/2-ele.offsetHeight/2);
          }
          else if(v.indexOf("%")!==-1)
          {
            var i = parseFloat(v)/100;
            changeObjects[lol]=(ele.scrollHeight-ele.offsetHeight)*i;
          }
        }
        changes[lol]=[parseFloat(styles[lol]),parseFloat(changeObjects[lol])-parseFloat(styles[lol]),"px",t];
      }
    }
    for(lol in changes)
    {
      if(lol == "scrollTop")
      {
        var v = xy(rap)*changes[lol][1]+changes[lol][0]
        console.log(xy(rap),changes[lol][1],changes[lol][0]);
        console.log(v);
        ele.scrollTop = v;
        continue;
      }
      switch(changes[lol][3])
      {
        case anitypes.size:
          unit = changes[lol][2];
          break;
        case anitypes.ratio:
        case anitypes.numeric:
          unit=0;
          break;
      }
      ele.style[lol]=(xy(rap)*changes[lol][1]+changes[lol][0])+unit;
    }
  };
  aniprox(dur,up);
  setTimeout(up,0);
  return changeObjects;
};
Element.prototype.remove=function(){this.parentElement.removeChild(this);}

var attele = {};

function price(flt)
{
  var t = ""+flt;
  var left = parseInt(t);
  var k = ",";
  if(t.indexOf(".")==-1)
  {
    return left+k+"00";
  }
  else
  {
    var right = (t.split(".")[1]);
    if(right.length >= 3)return left+k+right.substr(0,2);
    if(right.length == 1)return left+k+right+"0";
    return left+k+right;
  }

}

function na(st,flash)
{
  var na = document.createElement("div");
  na.innerHTML=st;
  na.className="nice_alert out";
  var nas = document.querySelectorAll(".nice_alert");
  for(var i = nas.length; --i>=0;)
  {
    nas[i].className+=" out out3";
  }

  document.body.appendChild(na);
  setTimeout(function(){
    na.className="nice_alert";
    if(flash)
    {
      setTimeout(function(){
        na.className+=" flash";
        setTimeout(function(){
          na.className=na.className.replace(/ ?flash/g,"");
        },100);
      },500);
    }
    setTimeout(function(){
      na.className="nice_alert out out2";
      setTimeout(function(){
        document.body.removeChild(na);
      },300);
    },5000);
  },50);
};

function highlight(nr)
{
  var opt = document.querySelectorAll(".side .more");
  for(var i = opt.length; --i>=0;)
  {
    opt[i].setAttribute("data-active","false");
  }
  if(nr >= 0 && nr < opt.length)
    opt[nr].setAttribute("data-active","true");
}

function postrequest(url,data,cb,asjson)
{
  cb = cb || function(){};
  asjson = !!asjson;
  var fd = new FormData();
  for(var lol in data)
  {
    fd.append(lol,data[lol]);
  }

  var xml = new XMLHttpRequest;
  xml.open("POST",url);
  xml.send(fd);
  xml.onload=function(){
    if(asjson)
    {
      var data = xml.responseText;
      try{
        data = JSON.parse(data);
        if("error" in data)
        {
          cb(data.error,true);
          return;
        }
      }catch(e){
        cb("Can not parse as JSON",true);
        return;
      }
      cb(data);
      return;
    }
    cb(xml.responseText);
  };
  xml.onerror=function()
  {
    cb(e.message,true);
  };
}
function request(url,cb,asjson)
{
  cb = cb || function(){};
  asjson = !!asjson;

  var xml = new XMLHttpRequest;
  xml.open("GET",url);
  xml.send(null);
  xml.onload=function(){
    if(asjson)
    {
      var data = xml.responseText;
      try{
        data = JSON.parse(data);
        if("error" in data)
        {
          cb(data.error,true);
          return;
        }
      }catch(e){
        cb("Can not parse as JSON",true);
        return;
      }
      cb(data);
      return;
    }
    cb(xml.responseText);
  };
  xml.onerror=function()
  {
    cb(e.message,true);
  };
}

function handleWSMessage(event)
{
  var d = event.data;
  console.log(event);
  try{d=JSON.parse(d)}catch(e){}
  console.log(d);
  if("action" in d)
  {
    switch(d.action)
    {
      case "event":
        if("event" in d)
        {
          if(d.event in ehandlers)
          {
            ehandlers[d.event](d.data);
          }
          else
          {
            console.log("SEND EVENT");
            sendEvent(d.event);
          }
        }
        break;
      default:
        console.log("NO ACTION FOUND FOR: "+d.action);
        break;
    }
  }
}

var api={
  "addextra":function(obj,cb){
    if(obj == null)throw "Missing param";
    cb = cb || function(){};
    postrequest("/api/addextra",{"data":JSON.stringify(obj)},function(json,error){
      if(error)
      {
        na(""+json);
      }
      cb(json);
    },true);
  },
  "addproduct":function(obj,cb){
    if(obj == null)throw "Missing param";
    cb = cb || function(){};
    postrequest("/api/addproduct",{"data":JSON.stringify(obj)},function(json,error){
      if(error)
      {
        na(""+json);
      }
      cb(json);
    },true);
  },
  "info":function(cb){
    cb = cb || function(){};
    request("/api/info",function(json,error){
      if(error)
      {
        na(json);
        return;
      }
      cb(json);
    },true);
  },
  "editextra":function(obj,cb){
    cb = cb || function(){};
    postrequest("/api/editextra",{data:JSON.stringify(obj)},cb,true);
  },
  "editproduct":function(obj,cb){
    cb = cb || function(){};
    postrequest("/api/editproduct",{data:JSON.stringify(obj)},cb,true);
  },
  "sendTableNumber":function(nr,cb)
  {
    cb = cb || function(){};
    postrequest("/api/settablecount",{number:nr},cb,true);
  },
  "startExec":function(){
    if(ws!==null)try{/*ws.close();*/}catch(e){}
    postrequest("/api/startexecution",{action:"start",password:password},function(json,error){
      if(!!error)
      {
        na("Errore durante l'esecuzione",true);
        return;
      }
      console.log("STARTED",json);
    },true);

  },
  "updateOneOrderlist":function(o){
    sendEvent("updateOneOrderlist",o);
  },
  "addorderlist":function(o){
    sendEvent("updateOrderlist",o);
  },
  "editUser":function(o,cb){
    postrequest("/api/edituser",o,function(json,error){
      if(!!error)
      {
        na(error,true);
        return;
      }
      !!cb && cb(json);
    },true);
  },
  "delUser":function(id,cb){
    postrequest("/api/deluser",{id:id},function(json,error){
      if(!!error)
      {
        na(error,true);
        return;
      }
      !!cb && cb(json);
    },true);
  }
};

function fadeInMain()
{
  var m = document.querySelector(".main");
  m.style.opacity="0";
  m.aniprox(400).opacity=1;
}

var menus={
  "products":function(event)
  {
    fadeInMain();
    var main = document.querySelector(".main");
    main.innerHTML="";
    main.appendChild(attele["products"]);
    var side = document.querySelector(".side");
    side.setAttribute("data-status","in");
    var inp = attele["products"].querySelector("input");
    !!inp && inp.focus();
  },
  "extra":function(event)
  {
    fadeInMain();
    var main = document.querySelector(".main");
    main.innerHTML="";
    main.appendChild(attele["extra"]);
    var side = document.querySelector(".side");
    side.setAttribute("data-status","in");
    var inp = attele["extra"].querySelector("input");
    !!inp && inp.focus();
  },
  "general":function(event)
  {
    fadeInMain();
    var main = document.querySelector(".main");
    main.innerHTML="";
    main.appendChild(attele["general"]);
    var side = document.querySelector(".side");
    side.setAttribute("data-status","in");
    var inp = attele["general"].querySelector("input");
    !!inp && inp.focus();
  },
  "run":function(event)
  {
    fadeInMain();
    var main = document.querySelector(".main");
    main.innerHTML="";
    main.appendChild(attele["run"]);
    var side = document.querySelector(".side");
    side.setAttribute("data-status","out");
    loadModule();
    api.startExec();
  }
};

function loadModule()
{
  var root = document.querySelector(".pops[data-action=\"run\"]");
  var eles={
    address:root.querySelector("[data-bind=\"address\"]"),
    ip:root.querySelector("[data-bind=\"ip\"]"),
    password:root.querySelector("[data-bind=\"password\"]"),
    stopbutton:root.querySelector("[data-bind=\"stopbutton\"]"),
    productsnumber:root.querySelector("[data-bind=\"productsnumber\"]"),
    tablenumber:root.querySelector("[data-bind=\"tablenumber\"]"),
    extranumber:root.querySelector("[data-bind=\"extranumber\"]"),
    orders:root.querySelector("[data-bind=\"orders\"]"),
    tables:root.querySelector("[data-bind=\"tables\"]"),
    incoming:root.querySelector("[data-bind=\"incoming\"]"),
    pending:root.querySelector("[data-bind=\"pending\"]"),
    users:root.querySelector("[data-bind=\"users\"]"),
    logs:root.querySelector("[data-bind=\"logs\"]"),
  }

  eles.ip.innerHTML=(serverInfo.address && serverInfo.webPort && "http://"+serverInfo.address+":"+serverInfo.webPort) || "no addr";
  eles.address.innerHTML=(serverInfo.links[0] &&  serverInfo.webPort && "http://"+serverInfo.links[0]+":"+serverInfo.webPort) || (serverInfo.hostname && serverInfo.webPort && "http://"+serverInfo.hostname+":"+serverInfo.webPort) || "no link";
  eles.password.innerHTML=password.length==0 ? (activeLanguage.noPassword || "nessuna password") : password;
  eles.stopbutton.innerHTML="<button>"+(activeLanguage.stop)+"</button>";
  eles.stopbutton.querySelector("button").addEventListener("click",function(event){
    event.preventDefault();
    event.stopPropagation();
    event.cancelBubble=true;
    if(confirm(activeLanguage.stopInfo || "Se fermi l'esecuzione, alcuni dati potrebbero venire persi"))
    {
      var side_ac = document.querySelectorAll(".side .more[data-active=\"true\"]");
      for(var i = side_ac.length; --i>=0;)
      {
        side_ac[i].setAttribute("data-active","false");
      }
      menus.general();
      highlight(0);
    }
  });

  eles.productsnumber.innerHTML=(activeLanguage.products || "Prodotti")+": 0";
  eles.extranumber.innerHTML=(activeLanguage.extra || "Extra")+": 0";
  eles.tablenumber.innerHTML=(activeLanguage.tables || "Tavoli")+": 0";
  eles.orders.innerHTML=(activeLanguage.orderTot || "Ordini totali")+": 0";
  eles.users.innerHTML=(activeLanguage.users || "Utenti")+": 0";
  eles.logs.innerHTML=(activeLanguage.logs || "Cronologia");
  var t = "<div class=\"info\"><i class=\"icon rot loading\"></i> "+(activeLanguage.waitForData)+"</div>";
  eles.tables.innerHTML=t;

  eles.incoming.innerHTML=(activeLanguage.earned || "Guadagno")+": ~0€";
  eles.pending.innerHTML=(activeLanguage.orderPending || "Ordini attivi")+": 0";
  rz.trigger();

  ehandlers.statsUpdate=function(data){
    eles.password.innerHTML=(data.password===false || data.password.length==0) ? (activeLanguage.noPassword || "nessuna password") : data.password;

    eles.productsnumber.innerHTML=(activeLanguage.products || "Prodotti")+": "+data.products;
    eles.extranumber.innerHTML=(activeLanguage.extra || "Extra")+": "+data.extras;
    eles.tablenumber.innerHTML=(activeLanguage.tables || "Tavoli")+": "+data.tables;
    eles.orders.innerHTML=(activeLanguage.orderTot || "Ordini totali")+": "+data.orders.total;
    eles.users.innerHTML=(activeLanguage.users || "Utenti")+": "+data.users;


    eles.incoming.innerHTML=(activeLanguage.earned || "Guadagno")+": ~"+data.earned+"€";
    eles.pending.innerHTML=(activeLanguage.orderPending || "Ordini attivi")+": "+data.orders.active;
    rz.trigger();

    var pwi = document.querySelector(".setting.list input[data-action=\"password\"]");
    if(!!pwi)
    {
      if(data.password=="false" || data.password==false || data.password.indexOf("false")==0)
      {
        pwi.value="";
        return;
      }
      pwi.value=data.password;
    }
  };
  
  var enableTableClickPopup = function(root)
  {
    var tbls = root.querySelectorAll(".table[data-id]");
    Array.from(tbls).forEach(function(a){
      a.addEventListener("click",function(event){
        var id = a.getAttribute("data-id");
        var t = document.createElement("div");
        t.setAttribute("data-table",id);
        t.innerHTML="<div class=\"left top_button auto\" data-action=\"close\"><span class=\"c\" data-translation=\"close\">Close</span></div>";
        var d = tabledata[id];
        var pending = d.pending;
        var content = document.createElement("div");
        content.className="table_content";
        
        var extraString = function(extraArr){
          extraArr=extraArr.extra;
          var t = extraArr.map(function(a){
            return a.price+a.name+" ("+price(a.price)+")€";
          });
          return t.join(", ");
        };
        
        var calcPrice = function(order)
        {
          return price(order.price)+"€";
        };
        
        pending.forEach(function(d){
          var ol = document.createElement("ol");
          ol.className="t_ele orderlist";
          
          var top = document.createElement("li");
          top.className="t_ele toporder";
          top.innerHTML="<span class=\"t_ele toporder_left\">"+activeLanguage.order+"</span><span class=\"t_ele toporder_right\"><button class=\"hl\">&#10003;</button></span>";
          ol.appendChild(top);
          
          var o  = d.orders;
          o.forEach(function(oi){
            var li = document.createElement("li");
            li.className="t_ele order";
            li.setAttribute("data-id",oi.id);
            li.innerHTML="<div class=\"left\"><div class=\"top\"><span class=\"name\">"+(oi.name)+"</span><span class=\"price\">"+calcPrice(oi)+"</span></div><div class=\"bottom\">"+extraString(oi)+"</div></div><div class=\"right\"><i class=\"icon done\" style=\"color:#1ab71a\"></i><i class=\"icon delete\"></i></div>";
            ol.appendChild(li);
          })
          t.appendChild(ol);
        });
        
        createPopup("<span class=\"stat_bullet "+a.className+"\"></span>"+a.querySelector(".label").innerHTML,t).show();
      });
    });
  };

  ehandlers.updateTablecount2=function(aObj)
  {
    var ts = aObj.tables, t="";
    if(ts.length==0)
    {
      eles.tables.innerHTML="<div class=\"info\">Non ci sono tavoli da servire</div>";
      return;
    }
    for(var i = 0; i < ts.length; i++)
    {
      t+="<div class=\"table "+(ts[i].pending.length > 0 ? "occupied" : "free")+"\" data-id=\""+ts[i].id+"\"><span class=\"label\">"+ts[i].name+"</span></div>";
      tabledata[ts[i].id]=ts[i];
    }
    eles.tables.innerHTML=t;
    enableTableClickPopup(eles.tables);
    try{
      Translation.applyTo(eles.tables);
    }catch(e){}
  }

  ws.send('{"get":"stats"}');
  ws.send('{"get":"tables"}');
};

rz={};
rz.dash_tab = function(root,or)
{
  var w = root.offsetWidth;
  var min_margin = 10;
  var ot = 0, tot, sw = 0, ow;
  var tables = root.querySelectorAll(".table");
  if(tables.length==0)return;
  ot = tables[0].offsetTop;
  ow = tables[0].offsetWidth;
  var epl = Math.floor(w/ow);
  if(typeof or !== undefined)epl--;
  var md = (w-(epl*ow));
  if(md < min_margin)
  {
    rz.dash_tab(root,-1);
    return;
  }
  for(var i = tables.length; --i>=0;)
  {
    tables[i].style.margin=((md*0.5)/(epl))+"px";
  }
};
rz.trigger=function(){
  var dash_tab = document.querySelector(".pops[data-action=\"run\"] .tables");
  !!dash_tab && rz.dash_tab(dash_tab);
};

function extraInit()
{
  var root = document.querySelector(".pops[data-action=\"extra\"]");

  var sto = root.querySelector(".stepon button");
  if(!!sto)sto.addEventListener("click",function(){
    menus.products();
    highlight(2);
  })

  var action_edit = function(li)
  {
    var done=function(){//DONE
      bCanc.remove();
      bSend.remove();
      name.innerHTML=vname;
      priceEle.innerHTML=price(parseFloat(vprice.replace(",",".")))+"&euro;";
      li.appendChild(act);
    };
    var save = function()
    {
      api.editextra({
        id:li.getAttribute("data-id"),
        name:nname.value,
        price:parseFloat(nprice.value)
      },function(json,error){
        if(error)
        {
          na(json,true);
          return;
        }
        na("Salvato");
        var m = json.modified;
        vname=m.name;
        vprice=price(m.price)+"&euro;";
        done();
      });
    };
    var name = li.querySelector(".name");
    var vname = name.innerHTML;
    var priceEle = li.querySelector(".price");
    var vprice = priceEle.innerHTML.replace(/,/,".").replace(/[^0-9\.]+/g,"");
    var act = li.querySelector(".actions");
    li.removeChild(act);
    name.innerHTML="<input type=\"text\">";
    priceEle.innerHTML="<input type=\"number\" min=\"0\" step=\"0.5\">";
    li.setAttribute("data-mode","editing");
    var nname = name.querySelector("input");
    var nprice = priceEle.querySelector("input");
    nname.addEventListener("keydown",function(event){if(event.keyCode==13){save();}})
    nprice.addEventListener("keydown",function(event){if(event.keyCode==13){save();}})
    nname.value=vname;
    nprice.value=vprice;
    var bCanc = document.createElement("button");
    bCanc.className="flexbutton";
    bCanc.innerHTML=activeLanguage.cancel || "Annulla";
    li.appendChild(bCanc);
    bCanc.addEventListener("click",done);
    var bSend = document.createElement("button");
    bSend.className="flexbutton main";
    bSend.innerHTML=activeLanguage.modify || "Modifica";
    li.appendChild(bSend);
    bSend.addEventListener("click",save);
    nname.focus();
  };

  var action_del = function(li)
  {
    var id = li.getAttribute("data-id");
    if(id.length==0){
      na("Questo elemento non è puro");
      return;
    }
    var act = li.querySelector(".actions");
    var nact = document.createElement("span");
    nact.className="actions";
    nact.innerHTML="<i class=\"icon loading rot\" style=\"color:#cb0b0b\"></i>";
    li.removeChild(act);
    li.appendChild(nact);

    postrequest("/api/delextra",{id:id},function(json,error){
      if(!!error)
      {
        na(json,true);
        li.removeChild(nact);
        li.appendChild(act);
        return;
      }
      try{
      li.parentNode.removeChild(li);
      na("Eliminato");
      }catch(e){}
    },true);
  };

  var add_actions = function(li){
    var act = li.querySelector(".actions");
    var edit = act.querySelector(".edit");
    var del = act.querySelector(".delete");
    edit.addEventListener("click",function(){
      action_edit(li);
    });
    del.addEventListener("click",function(){
      action_del(li);
    });
  }
  var extralist = root.querySelector(".list");

  //AddList
  var addlist = root.querySelector(".addlist");
  var add_name = root.querySelector(".nome");
  var reset_add_item=function(){
    add_name.value=add_price.value="";
  };
  var get_add_item = function()
  {
    return {
      name:add_name.value,
      price:(parseFloat(add_price.value.replace(/,/,".")) || 0)
    }
  };
  var simulate_addextra=function(dt)
  {
    var li = document.createElement("li");
    li.className="extra";
    li.innerHTML="<span class=\"name\">"+dt.name+"</span><span class=\"price\">"+price(dt.price)+"&euro;</span><span class=\"actions\"><i class=\"icon loading rot\"></i></span>";
    extralist.appendChild(li);
    return li;
  };
  add_name.addEventListener("keydown",function(event){
    if(event.keyCode==13)
    {
      event.preventDefault();
      add_price.focus();
    }
  });
  var fix_entry = function(li,info)
  {
    li.setAttribute("data-id",info.id);
    li.id="extra"+info.id;
    var eNm = li.querySelector(".name");
    var ePc = li.querySelector(".price");
    var eAc = li.querySelector(".actions");
    eNm.innerHTML=info.name;
    ePc.innerHTML=price(info.price)+"&euro;";
    eAc.innerHTML="<i class=\"icon edit\"></i><i class=\"icon delete\"></i>";
    add_actions(li);
  };

  var add_price = root.querySelector(".prezzo");
  add_price.addEventListener("keydown",function(){
    if(event.keyCode==13)
    {
      event.preventDefault();

      var gai = get_add_item();
      if(gai.name.length==0 || add_price.value.length==0)
      {
        menus.products();
        highlight(2);
        return;
      }

      var li = simulate_addextra(gai);
      api.addextra(gai,function(data){

        var id = data.added.id;
        var ele = root.querySelector("#extra"+id);
        if(!!ele)
        {
          li.remove();
          return;
        }

        fix_entry(li,data.added);
      });
      reset_add_item();
      add_name.focus();
    }
  });

  ehandlers.addExtra=function(p)
  {
    var id = p.id;
    var ele = root.querySelector("#extra"+id);
    if(!!ele)return;
    var li = simulate_addextra(p);
    fix_entry(li,p);
  }
  ehandlers.editExtra=function(p)
  {
    var id = p.id;
    var ele = root.querySelector("#extra"+id);
    if(!ele)return;
    ele.querySelector(".name").innerHTML=p.name;
    ele.querySelector(".price").innerHTML=price(p.price)+"&euro;";
  }
  ehandlers.delExtra=function(p)
  {
    var ele = root.querySelector("#extra"+p);
    if(!ele)return;
    ele.remove();
  }
  ehandlers.extrasUpdate=function(d)
  {
    extralist.innerHTML="";
    d.forEach(function(a){
      var li = simulate_addextra(a);
      fix_entry(li,a);
    });
  };
}

function productInit()
{
  var root = document.querySelector(".pops[data-action=\"products\"]");
  var so = root.querySelector(".stepon button");
  if(!!so)so.addEventListener("click",function(){
    menus.run();
    highlight(3);
  })

  var action_edit = function(li)
  {
    var done=function(){//DONE
      bCanc.remove();
      bSend.remove();
      name.innerHTML=vname;
      priceEle.innerHTML=price(parseFloat(vprice.replace(",",".")))+"&euro;";
      li.appendChild(act);
    };
    var save = function()
    {
      api.editproduct({
        id:li.getAttribute("data-id"),
        name:nname.value,
        price:parseFloat(nprice.value)
      },function(json,error){
        if(error)
        {
          na(json,true);
          return;
        }
        na("Salvato");
        var m = json.modified;
        vname=m.name;
        vprice=price(m.price)+"&euro;";
        done();
      });
    };
    var name = li.querySelector(".name");
    var vname = name.innerHTML;
    var priceEle = li.querySelector(".price");
    var vprice = priceEle.innerHTML.replace(/,/,".").replace(/[^0-9\.]+/g,"");
    var act = li.querySelector(".actions");
    li.removeChild(act);
    name.innerHTML="<input type=\"text\">";
    priceEle.innerHTML="<input type=\"number\" min=\"0\" step=\"0.5\">";
    li.setAttribute("data-mode","editing");
    var nname = name.querySelector("input");
    var nprice = priceEle.querySelector("input");
    nname.addEventListener("keydown",function(event){if(event.keyCode==13){save();}})
    nprice.addEventListener("keydown",function(event){if(event.keyCode==13){save();}})
    nname.value=vname;
    nprice.value=vprice;
    var bCanc = document.createElement("button");
    bCanc.className="flexbutton";
    bCanc.innerHTML=activeLanguage.cancel || "Annulla";
    li.appendChild(bCanc);
    bCanc.addEventListener("click",done);
    var bSend = document.createElement("button");
    bSend.className="flexbutton main";
    bSend.innerHTML=activeLanguage.modify || "Modifica";
    li.appendChild(bSend);
    li.appendChild(bSend);
    bSend.addEventListener("click",save);
    nname.focus();
  };

  var action_del = function(li)
  {
    var id = li.getAttribute("data-id");
    if(id.length==0){
      na("Questo elemento non è puro");
      return;
    }
    var act = li.querySelector(".actions");
    var nact = document.createElement("span");
    nact.className="actions";
    nact.innerHTML="<i class=\"icon loading rot\" style=\"color:#cb0b0b\"></i>";
    li.removeChild(act);
    li.appendChild(nact);

    postrequest("/api/delproduct",{id:id},function(json,error){
      if(!!error)
      {
        na(json,true);
        li.removeChild(nact);
        li.appendChild(act);
        return;
      }
      try{
        li.parentNode.removeChild(li);
        na("Eliminato");
      }catch(e){}
    },true);
  };

//TODO add action please
  var add_actions = function(li){
    var act = li.querySelector(".actions");
    var edit = act.querySelector(".edit");
    var del = act.querySelector(".delete");
    edit.addEventListener("click",function(){
      action_edit(li);
    });
    del.addEventListener("click",function(){
      action_del(li);
    });
  }
  var productlist = root.querySelector(".list");

  //AddList
  var addlist = root.querySelector(".addlist");
  var add_name = root.querySelector(".nome");
  var reset_add_item=function(){
    add_name.value=add_price.value="";
  };
  var get_add_item = function()
  {
    return {
      name:add_name.value,
      price:(parseFloat(add_price.value.replace(/,/,".")) || 0)
    }
  };
  var simulate_addextra=function(dt)
  {
    var li = document.createElement("li");
    li.className="extra";
    li.innerHTML="<span class=\"name\">"+dt.name+"</span><span class=\"price\">"+price(dt.price)+"&euro;</span><span class=\"actions\"><i class=\"icon loading rot\"></i></span>";
    productlist.appendChild(li);
    return li;
  };
  add_name.addEventListener("keydown",function(event){
    if(event.keyCode==13)
    {
      event.preventDefault();
      add_price.focus();
    }
  });
  var fix_entry = function(li,info)
  {
    li.setAttribute("data-id",info.id);
    li.id="product"+info.id;
    var eNm = li.querySelector(".name");
    var ePc = li.querySelector(".price");
    var eAc = li.querySelector(".actions");
    eNm.innerHTML=info.name;
    ePc.innerHTML=price(info.price)+"&euro;";
    eAc.innerHTML="<i class=\"icon edit\"></i><i class=\"icon delete\"></i>";
    add_actions(li);
  };

  var add_price = root.querySelector(".prezzo");
  add_price.addEventListener("keydown",function(){
    if(event.keyCode==13)
    {
      event.preventDefault();
      var gai = get_add_item();
      if(gai.name.length==0 || add_price.value.length==0)
      {
        menus.run();
        highlight(3);
        return;
      }

      var li = simulate_addextra(gai);
      api.addproduct(gai,function(data){
        var id = data.added.id;
        var ele = root.querySelector("#product"+id);
        if(!!ele)
        {
          li.remove();
          return;
        }
        fix_entry(li,data.added);
      });
      reset_add_item();
      add_name.focus();
    }
  });


  ehandlers.addProduct=function(p)
  {
    var id = p.id;
    var ele = root.querySelector("#product"+id);
    if(!!ele)return;
    var li = simulate_addextra(p);
    fix_entry(li,p);
  }
  ehandlers.editProduct=function(p)
  {
    var id = p.id;
    var ele = root.querySelector("#product"+id);
    if(!ele)return;
    ele.querySelector(".name").innerHTML=p.name;
    ele.querySelector(".price").innerHTML=price(p.price)+"&euro;";
  }
  ehandlers.delProduct=function(p)
  {
    var ele = root.querySelector("#product"+p);
    if(!ele)return;
    ele.remove();
  }
  ehandlers.orderableUpdate=function(d)
  {
    productlist.innerHTML="";
    d.forEach(function(a){
      var li = simulate_addextra(a);
      fix_entry(li,a);
    });
  }
}

function welcomeInit()
{
  var general = document.querySelector(".pops[data-action=\"general\"]");
  var passinput = general.querySelector("[data-action=\"password\"]");
  var tableinput = general.querySelector("[data-action=\"tablecount\"]");
  var uPass=function()
  {
    password=passinput.value;
  };
  passinput.addEventListener("keyup",uPass);
  passinput.addEventListener("change",uPass);
  passinput.addEventListener("input",uPass);
  passinput.addEventListener("keydown",function(event){
    if(event.keyCode==13){
      event.stopPropagation();
      event.preventDefault();
      menus.extra();
      highlight(1);
    }
  });

  var uTable = function()
  {
    api.sendTableNumber(parseInt(tableinput.value));
  }
  tableinput.addEventListener("blur",uTable);
  tableinput.addEventListener("keydown",function(event){
    if(event.keyCode==13)
    {
      event.preventDefault();
      tableinput.blur();
      passinput.focus();
    }
  });

  ehandlers.updateTablecount=function(aObj)
  {
    tableinput.value=aObj.count;
    console.log("TABLE OBJ",aObj);
    ehandlers.updateTablecount2(aObj);
  }
  var btn = general.querySelector(".stepon button");
  if(!!btn)
  {
    btn.addEventListener("click",function(){
      menus.extra();
      highlight(1);
    })
  }
}

var open_attempt=0;
var c_lost = false;

function handleConnectionLost()
{
  var alertDiv = document.querySelector(".alertDiv");
  if(!alertDiv)
  {
    alertDiv=document.createElement("div");
    alertDiv.innerHTML="<i class=\"icon rot loading\"></i>"+(activeLanguage.conLost || "Connessione persa");
    alertDiv.className="alertDiv";
    alertDiv.setAttribute("data-hidden","true");
    document.body.appendChild(alertDiv);
    setTimeout(function(){
      alertDiv.setAttribute("data-hidden","false");
    });
  }
}

function handleConnectionEstablished()
{
  var side = document.querySelector(".side");
  if(!!side && !(side.querySelector("[data-action=\"run\"][data-active=\"true\"]")))
  {
    side.setAttribute("data-status","in")
  }
  var info = document.querySelector(".info");
  if(!!info){
    info.innerHTML=activeLanguage.useInfo || "Seleziona un menu per visualizzare le impostazioni.";
  }
  var alertDiv = document.querySelector(".alertDiv");
  if(!!alertDiv)
  {
    alertDiv.setAttribute("data-hidden","true");
    setTimeout(function(){
      alertDiv.remove();
    },400);
  }
}

function connect(con_problem)
{
  if((open_attempt>10 && !con_problem)){
    c_lost=true;
    connect(true);
    handleConnectionLost();
    return;
  }
  ws=new WebSocket("ws://"+serverInfo.address+":"+serverInfo.socketPort);
  ws.onmessage=handleWSMessage;
  ws.onopen=function()
  {
    if(con_problem)
    {
      na(activeLanguage.reCon || "Connessione ripristinata");
      handleConnectionEstablished();
    }
    open_attempt=0;
    handleConnectionEstablished();
  };
  ws.onclose=function()
  {
    open_attempt++;
    setTimeout(connect,con_problem?5000:500);
  };
}

function getProductsAndExtras()
{
  if(ws.readyState==ws.OPEN)
  {
    ws.send('{"get":"extras"}');
    ws.send('{"get":"orderable"}');
    ws.send('{"get":"tables"}');
    ws.send('{"get":"users"}');
    return;
  }
  setTimeout(getProductsAndExtras,100);
}

//NOTE popup manager
function createPopup(title,element)
{
  var visible = false;
  var d = document.createElement("div");
  var handler = function(){}
  d.className="popup_backdrop";
  d.setAttribute("data-status","out");

  var c = document.createElement("div");
  c.className="popup_content";

  c.innerHTML="<div class=\"popup_title\">"+title+"</div><div class=\"popup_main\"></div>";
  var cp = c.querySelector(".popup_main");
  if(!!element && !!cp)cp.appendChild(element);

  d.appendChild(c);
  document.body.appendChild(d);

  var closebuttons = document.querySelectorAll("[data-action=\"close\"]");
  Array.from(closebuttons).forEach(function(btn){
    btn.addEventListener("click",function(){
      o.visible=false;
    });
  });

  var lShow = function()
  {
    d.setAttribute("data-status","in");
    Translation.applyTo(d);
    handler(o,c);
  }
  var lHide = function()
  {
    d.setAttribute("data-status","out2");
    setTimeout(function(){
      delete o;
      document.body.removeChild(d);
    },800);
  }

  var o={
    set title(value){
      title=value;
      var t = c.querySelector(".popup_title");
      t.innerHTML=title;
      Translation.applyTo(t);
    },
    get title(){
      return title;
    },
    show:function(tm)
    {
      setTimeout(function(){
        o.visible=true;
      },(!!tm && isFinite(tm)) || 0);
      return o;
    },
    hide:function()
    {
      setTimeout(function(){
        o.visible=false;
      },(!!tm && isFinite(tm)) || 0);
      return o;
    },
    set visible(bl){
      if(bl===true && visible!==bl)
      {
        visible=true;
        lShow();
      }
      else if(bl===false && visible!==bl)
      {
        visible=false;
        lHide();
      }
    },
    get visible(){return visible;},
    set shown(fx){
      handler=fx;
      if(visible)fx(o);
    },
    get shown(){
      return handler;
    }
  };
  activePopup=o;
  return o;
}

//NOTE User init
function userInit()
{
  var addUser;
  var root = document.querySelector(".hidden .popups[data-action=\"users\"]");
  var list = root.querySelector("#userlist");

  var createUserElement = function()
  {
    var li = document.createElement("li");
    li.className="user";
    li.innerHTML="<div class=\"name\">Username</div><div class=\"role\">Cook</div><div class=\"actions\"><i class=\"icon rot loading\"></i></div>";
    return li;
  };

  var loadDataIn=function(li,data){
    if("username" in data)
    {
      li.querySelector(".name").innerHTML=data.username;
    }
    if("role" in data)
    {
      li.querySelector(".role").innerHTML=data.role.html;
    }
    var actions = li.querySelector(".actions");
    actions.innerHTML="<i class=\"icon edit\"></i><i class=\"icon delete\"></i>";
    actions.querySelector(".icon.edit").addEventListener("click",function(){editUser(li);});
    actions.querySelector(".icon.delete").addEventListener("click",function(){removeUser(li);});

    if ("id" in data)
    {
      li.setAttribute("data-id",data.id);
    }

    Translation.applyTo(li);
  };

  var removeRemovable=function()
  {
    var rable = root.querySelectorAll("[data-canremove=\"true\"]");
    Array.from(rable).forEach(function(a){a.remove();})
  }

  var checkIfEmpty=function(){
    if(list.children.length==0){
      list.insertAdjacentHTML("afterBegin","<div data-canremove=\"true\" data-translation=\"helpUser\" class=\"placeholder\">Drücken Sie auf das <i class=\"icon add\"></i> Icon, um ein Benutzer hinzuzufügen.<br><div class=\"desc\"><h4>Rollen</h4><strong>Kellner:</strong> Kann aufs app zugreifen.<br><strong>Koch:</strong> Kann auf der Overview zugreifen.</div></div>");
    }
  };

  var removeUser = function(ele)
  {
    if(ele.hasAttribute("data-id"))
    {
      api.delUser(ele.getAttribute("data-id"));
    }
    ele.remove();
    checkIfEmpty();
  }

  var editUser = function(ele)
  {
    var name = ele.querySelector(".name");
    var role = ele.querySelector(".role");
    var actions = ele.querySelector(".actions");

    var vName = name.innerHTML;
    var vRole = role.innerHTML;

    var bCancel = document.createElement("button");
    bCancel.innerHTML=activeLanguage.cancel || "cancella";
    var bSubmit = document.createElement("button");
    bSubmit.innerHTML=activeLanguage.modify || "modifica";
    bSubmit.className="main";

    name.innerHTML="<input type=\"text\" placeholder=\"name\" value=\""+vName+"\" data-id=\"name\" autofocus>";
    role.innerHTML="<select class=\"styleselect\" data-name=\"role\"><option value=\"0\">"+(activeLanguage.waiter||"Cameriere")+"</option><option value=\"1\">"+(activeLanguage.cook||"Cuoco")+"</option></select>";
    ele.appendChild(bCancel);
    ele.appendChild(bSubmit);
    name.querySelector("input").addEventListener("keydown",function(event){
      if(event.keyCode==13){
        event.stopPropagation();
        event.preventDefault();
        submit();
        return;
      }
    });

    var cancel = function()
    {
      name.innerHTML=vName;
      role.innerHTML=vRole;
      bCancel.remove();
      bSubmit.remove();
      ele.appendChild(actions);
    };

    var submit = function()
    {
      var nvName = name.querySelector("input").value;
      var nvRole = role.querySelector("select");
      var nrOption = nvRole.options[nvRole.selectedIndex].innerHTML;
      nvRole=nvRole.value;
      name.innerHTML=nvName;
      role.innerHTML=nrOption;
      cancel();
      var o = {
        username:nvName,
        role:nvRole
      };
      var hasID = ele.hasAttribute("data-id");
      if(hasID)
      {
        o.id=ele.getAttribute("data-id");
      }
      api.editUser(o,function(json){
        ele.setAttribute("data-id",json.id);
        loadDataIn(ele,json);
        var le = list.querySelectorAll(".user[data-id=\""+json.id+"\"]");
        if(le.length>1)
        {
          for(var i = le.length; --i>0;)
          {
            le[i].remove();
          }
        }
        if(le.length==1)
        {
          loadDataIn(le[0],json);
        }
      });
    };

    bCancel.addEventListener("click",cancel);
    bSubmit.addEventListener("click",submit);

    actions.remove();
    var i = name.querySelector("input");
    i.focus();try{i.select();}catch(e){}
    delete i;

    Translation.applyTo(ele);
  }

  var addUser=function()
  {
    removeRemovable();
    var li = createUserElement();
    list.appendChild(li);
    editUser(li);
  };

  //CONSTRUCTOR
  var addbtns = Array.from(root.querySelectorAll("[data-action=\"add\"]"));
  addbtns.forEach(function(b){
    b.addEventListener("click",addUser);
  });

  ehandlers.addUser=function(data){
    if("id" in data){
      var l = list.querySelector("li[data-id=\""+data.id+"\"]");
      if(!!l){
        loadDataIn(l,data);
        return;
      }
    }
    removeRemovable();
    var li = createUserElement();
    loadDataIn(li,data);
    list.appendChild(li);
  };
  ehandlers.editUser=function(data){
    var e = list.querySelector("li[data-id=\""+data.id+"\"]");
    if(!!e){
      loadDataIn(e,data);
    }
  };
  ehandlers.delUser=function(data){
    var e = list.querySelector("li[data-id=\""+data+"\"]");
    if(!!e){
      e.remove();
    }
    checkIfEmpty();
  };
  ehandlers.usersUpdate=function(data){
    var found = [], e;
    data.forEach(function(d){
      var id = d.id;
      e = list.querySelector("li[data-id=\""+id+"\"]");
      if(!!e)
      {
        loadDataIn(e,d);
        found.push(e);
      }
      else if(!e)
      {
        var li = createUserElement();
        loadDataIn(li,d);
        list.appendChild(li);
        found.push(li);
      }
    });
    list.innerHTML="";
    found.forEach(function(e){
      list.appendChild(e);
    });
    checkIfEmpty();
  };
}


//NOTE log init
function logInit()
{
  var root = document.querySelector(".popups[data-action=\"logs\"]");
  var list = document.getElementById("loglist");
  
  var format = function(dt)
  {
    dt = new Date(dt);
    try{
      return dt.getHours()+":"+(dt.getMinutes() < 10 ? "0" : "")+dt.getMinutes();
    }catch(e){
      return format(new Date());
    }
  }
  
  var createElement = function(data){
    var li = document.createElement("li");
    li.className="log out";
    li.innerHTML="<span class=\"time\">"+format(data.time)+"</span><span class=\"content\">"+data.message+"</span>";
    setTimeout(function(){
      li.className="log";
    },64);
    return li;
  }
  
  ehandlers.addLog=function(data){
    var li = createElement(data);
    list.insertBefore(li,list.children[0]);
  }
}

//NOTE initializer
function init()
{
  var menuItems = document.querySelectorAll(".side div.more");
  var pops = document.querySelectorAll(".hidden .pops[data-action]");
  var popups = document.querySelectorAll(".hidden .popups[data-action]");

  //POPS
  var at = null;
  for(var i = pops.length; --i>=0;)
  {
    att=pops[i].getAttribute("data-action");
    attele[att]=pops[i];
  }
  for(var i = menuItems.length; --i>=0;)
  {
    menuItems[i].addEventListener("click",function(event){
      for(var j = menuItems.length; --j>=0;)
      {
        menuItems[j].setAttribute("data-active","false");
      }
      var e = event.target;
      while(!e.hasAttribute("data-action"))
      {
        e=e.parentElement;
      }
      menus[e.getAttribute("data-action")] (event);
      e.setAttribute("data-active","true");
    });
  }

  Array.apply(this,popups).forEach(function(a){
    window.popups[a.getAttribute("data-action")]=a;
  });

  welcomeInit();
  extraInit();
  productInit();
  userInit();
  logInit();
  api.info(function(data){
    (serverInfo=data);
    connect();
    getProductsAndExtras();
  });
  addEventListener("keydown",function(event){
    if(event.keyCode==13)
    {
      var s = document.querySelector(".side [data-active=\"true\"]");
      if(!s){
        menus.general();
        highlight(0);
      }
    }
    else if(event.keyCode==27)
    {
      var s = document.querySelector(".side [data-active=\"true\"]");
      var b = d
      ocument.querySelector(".sbtn[data-bind=\"stopbutton\"] button");
      if(!!b && !!s){event.preventDefault();b.click();}
    }
  });
  addEventListener("resize",rz.trigger);
  Translation.applyTo();

  /*setTimeout(function(){
    createPopup("<span data-translation=\"logs\">Logs</span>",window.popups.logs).show();
  },0);*/
}

//DEBUGGING
function debugme()
{
  gws = new WebSocket("ws://mbp.local:8181");
  gws.onmessage=function(event){
    console.log("RECIVED: "+event.data);
  }
  return gws;
}
