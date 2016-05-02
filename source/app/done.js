var Done = (function(baseSocketURL) {
  
  function Done(baseSocketURL) {
    var self = this
    
    // =============
    // = Properies =
    // =============
    
    self.DONE_AUTH_HEADER = 'DoneAuth'
    
    self.baseSocketURL = baseSocketURL
    self.connection = new WebSocket(self.baseSocketURL)
    
    var errorHandler = function () {
      try {
        self.connection = new WebSocket(self.baseSocketURL)
        self.connection.onclose = errorHandler
      } catch (error) {
        errorHandler()
      }
    }
    
    self.connection.onclose = errorHandler
    
    // ========
    // = Auth =
    // ========
    
    self.auth = function (username, password) {
      var accessToken = Crypto.sha1(`${username}::${password}`)
      
      self.accessToken = accessToken
      localStorage.setItem('auth', accessToken)
      
      document.getElementById('nav-view-settings').removeAttribute('dataset-notification')
    }
    
    // ==========
    // = Listen =
    // ==========
    
    self.listener = {}
    
    var trySend = function (string) {
      try {
        self.connection.send(string)
      } catch (variable) {
        setTimeout(function () { trySend(string) }, 100)
      }
    }
    
    self.send = function (object, type, callback) {
      if (type && callback) {
        if (!self.listener.hasOwnProperty(type)) {
          self.listener[type] = []
        }
        
        self.listener[type].push(callback)
      }
      
      trySend(JSON.stringify(object))
    }
    
    self.connection.onmessage = function (event) {
      var rawEvent = JSON.parse(event.data)
      var action = rawEvent.action
      var type = rawEvent.event
      var data = rawEvent.data
      
      if (self.listener.hasOwnProperty(type)) {
        self.listener[type].forEach(function (f) {
          f(action, type, data)
        })
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
    self.markFreeById  = function (id, callback) { return self.post('markFree', id, 'tableChange', callback) }
    
    // =======
    // = GET =
    // =======
    
    self.get = function (message, type, callback) {
      self.send({ get: message }, type, callback)
    }
    
    self.getTables    = function (callback) { return self.get('tables', 'updateTablecount', callback) }
    self.getOrderable = function (callback) { return self.get('orderable', 'changeOrderable', callback) }
    self.getExtras    = function (callback) { return self.get('extras', 'changeExtra', callback) }
    self.getQueue     = function (type, callback) { return self.get('queue', type, callback) }
  }
  
  return new Done(baseSocketURL)
  
}('ws://'+/*location.hostname*/'mbp.local'+':8181'))