INTERFACES
=====

Index
----
- [OBJECTS](#objects)
  - [ServerInfo](#serverinfo)
  - [URLResolvable](#urlresolvable)
  - [IPResolvable](#ipresolvable)
  - [IDResolvable](#idresolvable)
  - [IDResolvable](#orderlistobject)
  - [PasswordResolvable](#passwordresolvable)
  - [ExtraObject](#extraobject)
  - [ProductObject](#productobject)
- [HTTP / REST](#http)
- [WebSockets](#websocket)

OBJECTS
----
###ServerInfo
```
{
"webPort":8080,
"socketPort":8181,
"apiPrefix":"/api",
"hostname":"mbp.local",
"links":(URLResolvable),
"address":(IPResolvable)
}
```

###URLResolvable
String - local address that redirects to the main server in form of a domain name
*Example:* `mbp.local`

###IPResolvable
String - local address that redirects to the main server in form of a IPv4 address
*Example:* `192.168.1.10`

###IDResolvable
String - unique alfhanumeric combination to identify something

###PasswordResolvable
String or Bool - String that rapresents the password, `false`, `null`, `0` or `{empty string}` will translate to *no password* (free access).

###ExtraObject
Object rappresenting an Extra
*action* defines if the extra is added to the order or if it is removed.
```
{
"id":(IDResolvable),
"name":"NameOfExtra",
"price":0.0,
"action":'+'
}
```

###ProductObject
Object rappresenting an Product

**Notice:**
- *Status:* String that describes status (Done, Preparing)
- *statusCode:* A statud id number
- *copy:* Creates a copy of the instance (with other reference)

```
{
"id":(IDResolvable),
"name":"NameOfProduct",
"extra":[ExtraObject, ExtraObject, ...],
"price": 10.00,
"status":"none",
"statusCode":0,
"copy":()=>{return new self;}
}
```

###TableObject
Object rappresenting an Product

**Notice:**
- *Status:* String that describes status (Done, Preparing)
- *statusCode:* A statud id number
- *copy:* Creates a copy of the instance (with other reference)

```
{
"id":(IDResolvable),
"name":"NameOfProduct",
"nr":(NumberInt),
"isFree":(Bool),
"isPayed":(Bool),
"isWaiting":(Bool)
}
```

###OrderListObject
A list that holds orders and an ID
- *Id:* the id of the orderlist
- *Orders:* the list of the order
- *State:* the status of the order (to serve, to pay, pending, done)

```
{
"id":(IDResolvable),
"orders":[ProductObject, ProductObject, ...],
"state":"done"
}
```

###OrderListObject_withTableID
Is equal to the OrderListObject, but extended by a tableId attribute
```
{
"id":(IDResolvable),
"tableId":(IDResolvable),
"orders":[ProductObject, ProductObject, ...],
"state":"done"
}
```

###AddTableActionObject
```
{
"action":"settables",
"tables":[TableObject, TableObject, ...],
"count":0
}
```

###Event &lt;eventName,object&gt;
the `action` is static, and will always be `event`
```
{
"action":"event",
"event":<eventName>,
"data":<object>;
}
```

###StatsObject
```
{
"password":PasswordResolvable,
"products":123,
"extras":321,
"tables":25,
"earned":8000,00,
"order":{
    "active":2,
    "total":123
  }
}
```

HTTP
---
###GET
- **/api/tables** get tables
  - *response:* `[TableObject,TableObject, ...]`
- **/api/orderable** list of products
  - *response:* `[ProductObject, ProductObject, ...]`
- **/api/extras** list of products
  - *response:* `[ExtraObject, ExtraObject, ...]`
- **/api/orderid** get a orderid
  - *response:* `{"offer":'IDResolvable'}`
- **/api/info** get server info (port, etc...)
  - *response:* `ServerInfoObject`
- **/api/queue** get pending orders
  - *response:* `[OrderlistObject, OrderlistObject, ...]`

###POST
- **/api/addextra** add an extra
  - *Format:* `{"name":"productName","price":25.05}`
  - *Param name:* The name of the product
  - *Param price:* A double describing the price
  - *Response:* `{"added":(ExtraObject)}`
- **/api/editextra** add an extra
  - *Format:* `{"id":'a',"name":"productName","price":25.05}`
  - *Param id*: a string that rapresents the id of the product that has to be changed
  - *Param name:* The new name of the product
  - *Param price:* A double describing the new price
  - *Response:* `{"modified":(ExtraObject)}`
- **/api/delextra** add an extra
  - *Format:* `{"id":'c'}`
  - *Param id*: a string that rapresents the id of the product that will be deleted
  - *Response:* `{"deleted":(IDResolvable)}`
- **/api/addproduct** add an product
  - *Format:* `{"name":"productName","price":25.05}`
  - *Param name:* The name of the product
  - *Param price:* A double describing the price
  - *Response:* `{"added":(ProductObject)}`
- **/api/editproduct** add an product
  - *Format:* `{"id":'a',"name":"productName","price":25.05}`
  - *Param id*: a string that rapresents the id of the product that has to be changed
  - *Param name:* The new name of the product
  - *Param price:* A double describing the new price
  - *Response:* `{"modified":(ProductObject)}`
- **/api/delproduct** add an product
  - *Format:* `{"id":'c'}`
  - *Param id*: a string that rapresents the id of the product that will be deleted
  - *Response:* `{"deleted":(IDResolvable)}`
- **/api/settablecount** set number of tables
  - *Format:* `{"number":10}`
  - *Param number*: A integer that describes the amount of tables
  - *Response:* `(AddTableActionObject)`
- **/api/startexecution** set number of tables
  - *Format:* `{"password":PasswordResolvable}`
  - *Param password*: A keyword necessary to access the system
  
WebSocket
---
###Requests
- **Request:** `{"get":"stats"}`
 - **Response:** `(Event<"statsUpdate",StatsObject>)`
 - **Notice:** The response is broadcasted
- **Request:** `{"get":"tables"}`
 - **Response:** `(Event<"updateTablecount",AddTableActionObject>)`
- **Request:** `{"get":"orders"}`
 - **Response:** `(Event<"orderListUpdate",OrderList>)`
- **Request:** `{"get":"orderable"}`
 - **Response:** `(Event<"orderableUpdate",[ProductObject, ProductObject, ...]>)`
- **Request:** `{"get":"extras"}`
  - **Response:** `(Event<"extrasUpdate",[ExtraObject, ExtraObject, ...]>)`
- **Request:** `{"get":"queue"}`
  - **Response:** `(Event<"queueUpdate",[OrderListObject, OrderListObject, ...]>)`

####Posts
- **Post** `{"post":"orderlist","data":[OrderListObject_withTableID, OrderListObject_withTableID, ...]}`
 - **Event** `Event<"orderListAdded",OrderListObject>`
- **Post** `{"post":"extra","data":ExtraObject}`
 - **Event** `Event<"addExtra",ExtraObject>`
 - **Event** `Event<"editExtra",ExtraObject>`
 - **Notice** If ID exists it will be modified
- **Post** `{"post":"markFree","data":IDResolvable}`
 - **Event** `Event<"tableUpdate",TableObject>`


###Events
- **StatsUpdate:** `(Event<"statsUpdate",StatsObject>)`
- **DeleteExtra:** `(Event<"delExtra",IDResolvable>)`
- **EditExtra:** `(Event<"editExtra",ExtraObject>)`
- **AddExtra:** `(Event<"addExtra",ExtraObject>)`
- **DeleteProduct:** `(Event<"delProduct",IDResolvable>)`
- **EditProduct:** `(Event<"editProduct",ProductObject>)`
- **AddProduct:** `(Event<"addProduct",ProductObject>)`
- **updateTablecount:** `(Event<"updateTablecount",AddTableActionObject>)`
- **updateOrderlist:** `(Event<"updateOrderlist",[OrderListObject,OrderListObject,...]>)`
- **addOrderlist:** `(Event<"addOrderlist",[OrderListObject,OrderListObject,...]>)`
- **tableUpdate** `Event<"tableUpdate",TableObject>`
