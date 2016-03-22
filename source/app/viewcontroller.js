(function() {
  
  var self = this
  
  self.view = document.getElementById('view-tables')
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
    var title = document.getElementById('view-order--title')
    
    if (self.activeTable !== null) {
      title.innerHTML = `Table ${self.activeTable.number}`
    } else {
      title.innerHTML = 'No Orders to Show'
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
      self.activeTable = {
        number: parseInt(this.dataset.id, 10),
        pending: []
      }
      
      openTabById('view-order')
    })
    
    element.appendChild(contents)
    self.view.appendChild(element)
  })
  
  // ==========
  // = Events =
  // ==========
  
  function openTabById(id) {
    var oldView = self.activeView
    var newView = document.getElementById(id)
    
    oldView.setAttribute('hidden', 'hidden')
    newView.removeAttribute('hidden')
    
    document.getElementById('nav-'+oldView.id).classList.remove('active')
    document.getElementById('nav-'+newView.id).classList.add('active')
    
    triggerSelectTabEvents(newView.id)
    
    self.activeView = newView
    
    history.pushState('', document.title, location.pathname)
  }
  
  window.addEventListener('hashchange', function () {
    openTabById(location.hash.slice(1))
  })
  
}())