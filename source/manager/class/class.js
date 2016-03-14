module.exports = function Order(prod_id,name,type,extra,price)
{
  var self = this;
  this.id=null;
  this.prod_id=prod_id;
  this.name=name;
  this.type=type;
  this.extra=extra;
  this.price=price;
}