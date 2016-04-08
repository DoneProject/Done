global.OrderList = function(id)
{
  this.id=id || -1;
  this.state="pending"; //to serve, to pay, done
  this.orders=[];  
}
global.OrderList.INVALID=0;
global.OrderList.VALID_ID_MISSING=1;
global.OrderList.VALID=2;
global.OrderList.valid=function(obj)
{
  if("orders" in obj)
  {
    if("id" in obj)
    {
      return global.OrderList.prototype.VALID;
    }
    return global.OrderList.prototype.VALID_ID_MISSING;
  }
  else return global.OrderList.prototype.INVALID;
}

global.Order = function Order(id,name,extra,price)
{
  var self = this;
  this.id=id;
  this.name=name;
  this.extra=extra;
  this.price=price;
  this.stats="none";
  this.statusCode=0;
  this.copy = function()
  {
    return new Order(self.id,self.prod_id,self.name,self.extra,self.price);
  };
}

global.Extra = function Extra(id,name,price,action)
{
  var self = this;
  this.id=id || -1;
  this.name=name || "Senza nome";
  this.price = price || 0.0;
  this.action=action || "+";
}
global.Extra.INVALID=0;
global.Extra.VALID=1;
global.Extra.VALID_ID_MISSING=2;
global.Extra.valid=function(obj)
{
  if("name" in obj && "price" in obj)
  {
    if("id" in obj)
    {
      global.Extra.VALID_ID_MISSGING;
    }
    return global.Extra.VALID;
  }
  else
  {
    return global.Extra.INVALID;
  }
}

global.Table = function Table(id,name)
{
  var self = this;
  if(!id)throw "uncorrect definition";
  id = id || -1;
  this.nr=parseInt(id,36);
  this.name=name||"<span data-translation=\"tableName\">Tavolo</span> "+self.nr;
  this.id=id;
  this.isFree=true;
  this.isPayed=false;
  this.isWaiting=false;
  this.pending=[];
  this.setNR=function(nr){
    self.nr=nr;
    if(!name)
      self.name="<span data-translation=\"tableName\">Tavolo</span> "+self.nr;
    return self;
  };
}