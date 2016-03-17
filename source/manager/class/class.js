global.Order = function Order(id,prod_id,name,extra,price)
{
    var self = this;
    this.id=id || -1;
    this.prod_id=prod_id;
    this.name=name;
    this.extra=extra;
    this.price=price;
    this.copy = function()
    {
        return new Order(self.id,self.prod_id,self.name,self.extra,self.price);
    };
}

global.Extra = function Order(id,name,price,action)
{
    var self = this;
    this.id=id || -1;
    this.name=name || "Senza nome";
    this.price = price || 0.0;
    this.action=action || "+";
}