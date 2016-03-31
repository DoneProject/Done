var Done = (function(baseSocketURL) {
  
  function Done(baseSocketURL) {
    var self = this
    
    // =============
    // = Properies =
    // =============
    
    self.DONE_AUTH_HEADER = 'DoneAuth'
    
    self.baseSocketURL = baseSocketURL
    self.connection = new WebSocket(self.baseSocketURL)
    self.callback = function (event, success) { }
    
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
    
    self.auth = function (accessToken) {
      self.accessToken = accessToken
    }
    
    // ==========
    // = Listen =
    // ==========
    
    self.listener = {}
    
    self.send = function (object, type, callback) {
      if (type && callback) {
        if (!self.listener.hasOwnProperty(type)) {
          self.listener[type] = []
        }
        
        self.listener[type].push(callback)
      }
      
      self.connection.send(JSON.stringify(object))
    }
    
    self.connection.onmessage = function (event) {
      var rawEvent = JSON.parse(event.data)
      var action = rawEvent.action
      var type = rawEvent.event
      var data = rawEvent.data
      
      console.log('Incoming Message', data)
      
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
    
    // =======
    // = GET =
    // =======
    
    self.get = function (message, type, callback) {
      self.send({ get: message }, type, callback)
    }
    
    self.getTables    = function (type, callback) { return self.get('tables', type, callback) }
    self.getOrderable = function (type, callback) { return self.get('orderable', type, callback) }
    self.getExtras    = function (type, callback) { return self.get('extras', type, callback) }
    self.getQueue     = function (type, callback) { return self.get('queue', type, callback) }
    
    // ==================
    // = Event Listener =
    // ==================
    
    self.connection.addEventListener('message', function (event) {
      return self.callback(event, true)
    })
    
    self.connection.addEventListener('error', function (event) {
      return self.callback(event, false)
    })
  }
  
  return new Done(baseSocketURL)
  
}('ws://mbp.local:8181'))