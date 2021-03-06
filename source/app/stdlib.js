function OrderList(id) {
  this.id = id || -1
  this.orders = []
}

function Order(id, name, extras, price) {
  this.id = id
  this.name = name
  this.extras = extras
  this.price = price
  this.stats = 'none'
  this.statusCode = 0
}

Order.prototype.copy = function () {
  return Order(this.id, this.productId, this.name, this.extras, this.price)
}

function Extra(id, name, price, action) {
  this.id = id || -1
  this.name = name || 'Senza nome'
  this.price = price || 0
  this.action = action || '+'
}

function Table(id, name, pending, isFree, isPayed, isWaiting, nr) {
  this.id = id || -1
  this.nr = nr
  this.name = name || '<span data-translation="tableName">Tavolo</span> ' + id
  this.pending = pending || []
  this.isFree = isFree
  this.isPayed = isPayed
  this.isWaiting = isWaiting
}