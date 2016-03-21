(function() {
  
  var self = this
  
  self.views = []
  self.activeView = null
  self.activeTable = null
  self.selectTabEvents = []
  
  // ===============
  // = Select View =
  // ===============
  
  var triggerSelectTabEvents = function (tabId) {
    tabName = tabId.slice(5)
    
    
    self.selectTabEvents.filter(function (x) {
      return x.tabName === tabName
    }).forEach(function (x) {
      x.action()
    })
  }
  
  self.selectTabEvents.push({ tabName: 'order', action: function () {
    // Load self.activeTable
    
  }})
  
  // ========
  // = Init =
  // ========
  
  var views = document.getElementsByClassName('view')
  
  for (var i = 0; i < views.length; i += 1) {
    self.views.push(views[i])
  }
  
  self.views.forEach(function (x, index) {
    if (index > 0) {
      x.setAttribute('hidden', 'hidden')
    } else {
      self.activeView = x
      document.getElementById('nav-'+x.id).classList.add('active')
      triggerSelectTabEvents(x.id)
    }
  })
  
  // ==========
  // = Events =
  // ==========
  
  window.addEventListener('hashchange', function () {
    var hash = location.hash
    
    var id = hash.slice(1)
    var oldView = self.activeView
    var newView = document.getElementById(id)
    
    oldView.setAttribute('hidden', 'hidden')
    newView.removeAttribute('hidden')
    
    document.getElementById('nav-'+oldView.id).classList.remove('active')
    document.getElementById('nav-'+newView.id).classList.add('active')
    
    triggerSelectTabEvents(newView.id)
    
    self.activeView = newView
    
    history.pushState('', document.title, location.pathname)
  })
  
}())