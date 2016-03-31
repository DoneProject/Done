(function() {
  
  var self = this
  
  self.view = document.getElementById('view-tables')
  self.views = []
  self.title = document.getElementById('view-title')
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
    if (self.activeTable !== null) {
      self.title.innerHTML = self.activeTable.name
    } else {
      self.title.innerHTML = 'Order'
    }
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
  
  // =========
  // = Logic =
  // =========
  
  var is = (function(from, to) {
    var range = []
    for (var i = from; i <= to; i += 1) {
      range.push(i)
    }
    return range
  }(1, 14))
  
  is.forEach(function (x) {
    var element  = document.createElement('div')
    var contents = document.createElement('div')
    
    element.id = `table-${x}`
    element.dataset.id = x
    element.classList.add('table')
    contents.classList.add('table-contents')
    
    contents.innerHTML = `T${x}`
    
    element.addEventListener('click', function () {
      self.activeTable = new Table(parseInt(this.dataset.id, 10))
      
      openTabById('view-order', true)
    })
    
    element.appendChild(contents)
    self.view.appendChild(element)
  })
  
  // ==========
  // = Events =
  // ==========
  
  function openTabById(id, animate) {
    animate = animate === true
    
    var oldView = self.activeView
    var newView = document.getElementById(id)
    
    newView.classList.remove('inactive')
    
    if (animate) {
      Velocity(oldView, 'slideUp', { duration: 300, easing: 'ease-out' })
      oldView.classList.add('inactive')
    } else {
      oldView.setAttribute('hidden', 'hidden')
      oldView.style.display = 'none'
    }
    
    newView.removeAttribute('hidden')
    newView.style.display = 'block'
    
    document.getElementById('nav-'+oldView.id).classList.remove('active')
    document.getElementById('nav-'+newView.id).classList.add('active')
    
    self.title = 'Done'
    
    triggerSelectTabEvents(newView.id)
    
    self.activeView = newView
    
    history.pushState('', document.title, location.pathname)
  }
  
  window.addEventListener('hashchange', function () {
    openTabById(location.hash.slice(1))
  })
  
}())