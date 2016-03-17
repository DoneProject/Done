global.Order = function Order(id,prod_id,name,type,extra,price)
{
    var self = this;
    this.id=id || -1;
    this.prod_id=prod_id;
    this.name=name;
    this.type=type;
    this.extra=extra;
    this.price=price;
}

global.Extra = function Order(id,name,price,action)
{
    var self = this;
    this.id=id || -1;
    this.name=name || "Senza nome";
    this.price = price || 0.0;
    this.action=action || "+";
}