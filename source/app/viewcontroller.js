var vc = (function() {
  
  var self = {}
  
  self.view = document.getElementById('view-tables')
  self.views = []
  self.title = document.getElementById('view-title')
  self.activeView = null
  self.activeTable = null
  self.activeTableOrders = document.getElementById('active-table-orders')
  self.selectTabEvents = []
  self.buttons = {
    addOrder: document.getElementById('add-order-button'),
    markAsFree: document.getElementById('mark-as-free-button')
  }
  self.inputs = {
    order: document.getElementById('order'),
    extras: document.getElementById('extras'),
    username: document.getElementById('username'),
    password: document.getElementById('password')
  }
  self.suggestions = {
    order: document.getElementById('order-suggestions'),
    extras: document.getElementById('extras-suggestions')
  }
  self.inLeftHandedMode = false
  
  // =========
  // = Modes =
  // =========
  
  if (localStorage.getItem('left-handed-mode') === '1') {
    document.body.classList.add('left-handed-mode')
    self.inLeftHandedMode = true
  }
  
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
  
  self.selectTabEvents.push({ tabName: 'table', action: function () {
    self.title.innerHTML = 'Order'
    
    if (self.activeTable === null) {
      self.buttons.addOrder.setAttribute('hidden', 'hidden')
    } else {
      self.buttons.addOrder.removeAttribute('hidden')
    }
    
    if (self.activeTable === null) {
      self.activeTableOrders.innerHTML = '<li class="empty">No Table</li>'
    } else {
      self.title.innerHTML = self.activeTable.name
      
      if (self.activeTable.pending.length <= 0) {
        self.activeTableOrders.innerHTML = '<li class="empty">No Orders</li>'
      } else {
        self.activeTableOrders.innerHTML = ''
      }
    }
  }})
  
  self.selectTabEvents.push({ tabName: 'add-order', action: function () {
    self.title.innerHTML = 'Add Order'
    
    setTimeout(function () {
      self.inputs.order.focus()
    }, 300)
  }})
  
  self.selectTabEvents.push({ tabName: 'settings', action: function () {
    self.title.innerHTML = 'Settings'
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
  
  self.openTabById = function (id, animate) {
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
    
    var newViewTab = document.getElementById('nav-'+newView.id)
    
    if (newViewTab) {
      Array.from(document.getElementsByClassName('active')).forEach(function (x) {
        x.classList.remove('active')
      })
      newViewTab.classList.add('active')
    }
    
    self.title.innerHTML = 'Done'
    
    triggerSelectTabEvents(newView.id)
    
    self.activeView = newView
    
    history.pushState('', document.title, location.pathname)
  }
  
  window.addEventListener('hashchange', function () {
    self.openTabById(location.hash.slice(1))
  })
  
  return self
  
}())