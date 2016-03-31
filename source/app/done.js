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
    
    // ========
    // = Auth =
    // ========
    
    self.auth = function (accessToken) {
      self.accessToken = accessToken
    }
    
    // ========
    // = POST =
    // ========
    
    self.post = function (message, data) {
      return self.connection.send(JSON.stringify({ post: message, data: data }))
    }
    
    self.postTables    = function (data, callback) { return self.post('tables', data, callback) }
    self.postOrderable = function (data, callback) { return self.post('orderable', data, callback) }
    self.postExtras    = function (data, callback) { return self.post('extras', data, callback) }
    self.postQueue     = function (data, callback) { return self.post('queue', data, callback) }
    
    // =======
    // = GET =
    // =======
    
    self.get = function (message, callback) {
      self.connection.send(JSON.stringify({ get: message }))
    }
    
    self.getTables    = function (callback) { return self.get('tables', callback) }
    self.getOrderable = function (callback) { return self.get('orderable', callback) }
    self.getExtras    = function (callback) { return self.get('extras', callback) }
    self.getQueue     = function (callback) { return self.get('queue', callback) }
    
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