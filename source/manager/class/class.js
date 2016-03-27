global.OrderList = function(id)
{
  this.id=id || -1;
  this.state="pensing"; //to serve, to pay, payed
  this.orders=[];
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

global.Table = function Table(id,name)
{
  if(!id)throw "uncorrect definition";
  id = id || -1;
  this.name=name||"Tavolo "+id;
  this.id=id;
  this.pending=[];
}