serverInfo={};
password="";
ws = null;

function sendEvent(name,element)
{
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

var ws;

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
        if(ws!==null)try{ws.close();}catch(e){}
        postrequest("/api/startexecution",{action:"start",password:password},function(json,error){
            if(!!error)
            {
                na("Errore durante l'esecuzione",true);
                return;
            }
            console.log("STARTED",json);
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
    },
    "extra":function(event)
    {
        fadeInMain();
        var main = document.querySelector(".main");
        main.innerHTML="";
        main.appendChild(attele["extra"]);
        var side = document.querySelector(".side");
        side.setAttribute("data-status","in");
    },
    "general":function(event)
    {
        fadeInMain();
        var main = document.querySelector(".main");
        main.innerHTML="";
        main.appendChild(attele["general"]);
        var side = document.querySelector(".side");
        side.setAttribute("data-status","in");
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
        pending:root.querySelector("[data-bind=\"pending\"]")
    }
    
    eles.ip.innerHTML=(serverInfo.address && serverInfo.webPort && "http://"+serverInfo.address+":"+serverInfo.webPort) || "no addr";
    eles.address.innerHTML=(serverInfo.links[0] &&  serverInfo.webPort && "http://"+serverInfo.links[0]+":"+serverInfo.webPort) || (serverInfo.hostname && serverInfo.webPort && "http://"+serverInfo.hostname+":"+serverInfo.webPort) || "no link";
    eles.password.innerHTML=password.length==0 ? "nessuna password" : password;
    eles.stopbutton.innerHTML="<button>Ferma</button>";
    eles.stopbutton.querySelector("button").addEventListener("click",function(event){
        event.preventDefault();
        event.stopPropagation();
        event.cancelBubble=true;
        if(confirm("Se fermi l'esecuzione, alcuni dati potrebbero venire persi"))
        {
            var side_ac = document.querySelectorAll(".side .more[data-active=\"true\"]");
            for(var i = side_ac.length; --i>=0;)
            {
                side_ac[i].setAttribute("data-active","false");
            }
            menus.general();
        }
    });
    
    eles.productsnumber.innerHTML="Prodotti: 0";
    eles.extranumber.innerHTML="Extra: 0";
    eles.tablenumber.innerHTML="Tavoli: 0";
    eles.orders.innerHTML="Ordini totali: 0";
    
    var t = "";
    var classes = ["occupied","free","leaving"];
    for(var i = 10; i--;)
    {
        t+="<div class=\"table "+classes[Math.floor(Math.random()*classes.length)]+"\"><span class=\"label\">Tavolo "+i+"</span></div>";
    }
    eles.tables.innerHTML=t;
    
    eles.incoming.innerHTML="Guadagnio: ~0€";
    eles.pending.innerHTML="Ordini attivi: 0";
    rz.trigger();
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
    addEventListener("extra",function(){
        
    });
    
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
        bCanc.innerHTML="Annulla";
        li.appendChild(bCanc);
        bCanc.addEventListener("click",done);
        var bSend = document.createElement("button");
        bSend.className="flexbutton main";
        bSend.innerHTML="Modifica";
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
            li.parentNode.removeChild(li);
            na("Eliminato");
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
            var li = simulate_addextra(gai);
            api.addextra(gai,function(data){
                fix_entry(li,data.added);
            });
            reset_add_item();
            add_name.focus();
        }
    });
    
    //DEV
    var gai = {name:"Test",price:2.7};
    var li = simulate_addextra(gai);
}

function productInit()
{
    var root = document.querySelector(".pops[data-action=\"products\"]");
    addEventListener("product",function(){
        
    });

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
        bCanc.innerHTML="Annulla";
        li.appendChild(bCanc);
        bCanc.addEventListener("click",done);
        var bSend = document.createElement("button");
        bSend.className="flexbutton main";
        bSend.innerHTML="Modifica";
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
            li.parentNode.removeChild(li);
            na("Eliminato");
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
        li.setAttribute("data-id",info.prod_id);
        li.id="product"+info.prod_id;
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
            var li = simulate_addextra(gai);
            api.addproduct(gai,function(data){
                fix_entry(li,data.added);
            });
            reset_add_item();
            add_name.focus();
        }
    });

    //DEV
    var gai = {name:"Test",price:2.7};
    var li = simulate_addextra(gai);
    api.addproduct(gai,function(data){
        fix_entry(li,data.added);
    });
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
}

function init()
{
    var menuItems = document.querySelectorAll(".side div.more");
    var pops = document.querySelectorAll(".hidden .pops[data-action]");
    
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
    
    welcomeInit();
    extraInit();
    productInit();
    api.info(function(data){
        console.log(serverInfo=data);
    });
    addEventListener("resize",rz.trigger);
}