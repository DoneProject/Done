var Done = (function(baseSocketURL) {
  
  function Done(baseSocketURL) {
    var self = this
    
    // =============
    // = Properies =
    // =============
    
    self.DONE_AUTH_HEADER = 'DoneAuth'
    self.accessToken = (function() {
      // check for access token
      if (localStorage.getItem('auth')) {
        return localStorage.getItem('auth')
      } else {
        return null
      }
    }())
    
    self.baseSocketURL = baseSocketURL
    self.connection = new WebSocket(self.baseSocketURL)
    
    var errorHandler = function () {
      // retry to connect to the ws
      try {
        self.connection = new WebSocket(self.baseSocketURL)
        self.connection.onclose = errorHandler
      } catch (error) {
        errorHandler()
      }
    }
    
    self.connection.onclose = errorHandler;
    
    // ========
    // = Auth =
    // ========
    
    self.auth = function (username, password) {
      // generate access token
      var accessToken = Crypto.sha1(username + '::' + password)
      
      // set access token
      self.accessToken = accessToken
      localStorage.setItem('auth', accessToken)
    }
    
    // ==========
    // = Listen =
    // ==========
    
    self.listener = {}
    
    var trySend = function (string) {
      // try sending the message and retry if failed
      try {
        self.connection.send(string)
      } catch (variable) {
        setTimeout(function () { trySend(string) }, 100)
      }
    }
    
    self.send = function (object, type, callback) {
      // add auth header
      object[self.DONE_AUTH_HEADER] = self.accessToken
      
      // add callback function
      if (type && callback) {
        if (!self.listener.hasOwnProperty(type)) {
          self.listener[type] = []
        }
        
        self.listener[type].push(callback)
      }
      
      trySend(JSON.stringify(object))
    }
    
    function sendMessage(rawEvent) {
      var action = rawEvent.action
      var type = rawEvent.event
      var data = rawEvent.data
      
      if (self.listener.hasOwnProperty(type)) {
        // call all callbacks
        self.listener[type].forEach(function (f) {
          if (typeof f === 'function') {
            f(action, type, data)
          }
        })
      }
    }
    
    var pendingRawEvents = []
    
    function flushRequests() {
      pendingRawEvents.forEach(function (x) {
        sendMessage(x)
      })
      
      pendingRawEvents = []
    }
    
    function tryFlush() {
      var token = self.accessToken === null ? '' : self.accessToken
      self.connection.send(self.accessToken)
    }
    
    self.connection.onmessage = function (event) {
      try {
        // handle events
        var rawEvent = JSON.parse(event.data)
      } catch (error) {
        if (event.data === 'true') {
          flushRequests()
        } else {
          setTimeout(function () {
            tryFlush()
          }, 150)
        }
        return
      }
      
      if (rawEvent.event === 'authenticationError') {
        pendingRawEvents.push(rawEvent)
        tryFlush()
        
        document.getElementById('nav-view-settings').dataset.notification = '1'
      } else {
        sendMessage(rawEvent)
      }
    }
    
    // ========
    // = POST =
    // ========
    
    self.post = function (message, data, type, callback) {
      return self.send({ post: message, data: data }, type, callback)
    }
    
    self.postTables    = function (data, type, callback) { return self.post('tables', data, type, callback) }
    self.postOrderable = function (data, type, callback) { return self.post('orderable', data, type, callback) }
    self.postExtras    = function (data, type, callback) { return self.post('extras', data, type, callback) }
    self.postQueue     = function (data, type, callback) { return self.post('queue', data, type, callback) }
    self.markFreeById  = function (id, callback)         { return self.post('markFree', id, 'tableChange', callback) }
    self.postOrder     = function (tableId, order)       { return self.post('orderListAdd', { table: tableId, order: order }) }
    self.deleteOrder   = function (orderlistId)          { return self.post('delOrderlist', orderlistId ) }
    
    // =======
    // = GET =
    // =======
    
    self.get = function (message, type, callback) {
      self.send({ get: message }, type, callback)
    }
    
    self.changeTable  = function (callback) { return self.get('tables', 'tableChange', callback) }
    self.getTables    = function (callback) { return self.get('tables', 'updateTablecount', callback) }
    self.getOrderable = function (callback) { return self.get('orderable', 'changeOrderable', callback) }
    self.getExtras    = function (callback) { return self.get('extras', 'changeExtra', callback) }
    self.getQueue     = function (type, callback) { return self.get('queue', type, callback) }
  }
  
  return new Done(baseSocketURL)
  
}('ws://'+/*location.hostname*/'flexlex-mbp.local'+':8181'))