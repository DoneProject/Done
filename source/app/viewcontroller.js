(function() {
  
  var self = this
  
  self.views = []
  self.activeView = null
  
  var views = document.getElementsByClassName('view')
  
  for (var i = 0; i < views.length; i += 1) {
    self.views.push(views[i])
  }
  
  self.views.forEach(function (x, index) {
    if (index > 0) {
      x.setAttribute('hidden', 'hidden')
    } else {
      self.activeView = x
      document.getElementById('nav-'+self.activeView.id).classList.add('active')
    }
  })
  
  window.addEventListener('hashchange', function () {
    var hash = location.hash.slice(1)
    var oldView = self.activeView
    var newView = document.getElementById(hash)
    
    oldView.setAttribute('hidden', 'hidden')
    newView.removeAttribute('hidden')
    
    document.getElementById('nav-'+oldView.id).classList.remove('active')
    document.getElementById('nav-'+newView.id).classList.add('active')
    
    self.activeView = newView
  })
  
}())