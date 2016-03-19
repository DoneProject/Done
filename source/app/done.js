var Done = (function(baseSocketURL) {
  
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
  
  self.postTables    = function (data) { return self.post('tables', data) }
  self.postOrderable = function (data) { return self.post('orderable', data) }
  self.postExtras    = function (data) { return self.post('extras', data) }
  self.postQueue     = function (data) { return self.post('queue', data) }
  
  // =======
  // = GET =
  // =======
  
  self.get = function (message) {
    return self.connection.send(JSON.stringify({ get: message }))
  }
  
  self.getTables    = function () { return self.get('tables') }
  self.getOrderable = function () { return self.get('orderable') }
  self.getExtras    = function () { return self.get('extras') }
  self.getQueue     = function () { return self.get('queue') }
  
  // ==================
  // = Event Listener =
  // ==================
  
  self.connection.addEventListener('message', function (event) {
    return self.callback(event, true)
  })
  
  self.connection.addEventListener('error', function (event) {
    return self.callback(event, false)
  })
  
  return self
  
}('ws://localhost'))