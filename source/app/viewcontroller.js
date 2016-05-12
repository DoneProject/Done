var vc = (function() {
  
  var self = {}
  
  self.DONE_LOGO_HTML = '<svg xmlns="http://www.w3.org/2000/svg" id="done-logo" width="226" height="67" viewBox="0 0 226 67" version="1.1" xml:space="preserve" stroke-linejoin="round"><path d="M61 32.6c0 5.7-1.1 10.7-3.2 14.9 -2.1 4.2-4.9 7.6-8.4 10.3 -3.5 2.7-7.4 4.7-11.8 5.9 -4.4 1.3-8.8 1.9-13.3 1.9l-24.4 0 0-65.5 23.6 0c4.6 0 9.2 0.5 13.7 1.6 4.5 1.1 8.5 2.9 12 5.4 3.5 2.5 6.3 5.8 8.5 10 2.2 4.2 3.2 9.4 3.2 15.5ZM44.6 32.6c0-3.7-0.6-6.8-1.8-9.2 -1.2-2.4-2.8-4.4-4.8-5.8 -2-1.4-4.3-2.5-6.8-3.1 -2.6-0.6-5.2-0.9-7.9-0.9l-7.8 0 0 38.3 7.5 0c2.8 0 5.6-0.3 8.2-1 2.6-0.6 4.9-1.7 6.9-3.2 2-1.5 3.6-3.5 4.8-5.9 1.2-2.5 1.8-5.5 1.8-9.2ZM117.6 42.3c0 3.8-0.7 7.2-2 10.2 -1.4 3.1-3.2 5.6-5.5 7.8 -2.3 2.1-5 3.8-8.1 5 -3.1 1.2-6.4 1.8-9.9 1.8 -3.4 0-6.7-0.6-9.8-1.8 -3.1-1.2-5.8-2.8-8.1-5 -2.3-2.1-4.1-4.7-5.5-7.8 -1.4-3.1-2-6.5-2-10.2 0-3.8 0.7-7.2 2-10.2 1.4-3 3.2-5.6 5.5-7.7 2.3-2.1 5-3.7 8.1-4.8 3.1-1.1 6.4-1.7 9.8-1.7 3.5 0 6.8 0.6 9.9 1.7 3.1 1.1 5.8 2.7 8.1 4.8 2.3 2.1 4.2 4.7 5.5 7.7 1.4 3 2 6.4 2 10.2ZM103 42.3c0-1.5-0.2-2.9-0.7-4.3 -0.5-1.4-1.2-2.7-2.1-3.7 -0.9-1.1-2.1-2-3.4-2.6 -1.4-0.7-2.9-1-4.7-1 -1.8 0-3.4 0.3-4.7 1 -1.4 0.7-2.5 1.6-3.4 2.6 -0.9 1.1-1.6 2.3-2 3.7 -0.5 1.4-0.7 2.9-0.7 4.3 0 1.5 0.2 2.9 0.7 4.4 0.5 1.4 1.2 2.7 2.1 3.8 0.9 1.1 2.1 2.1 3.4 2.7 1.4 0.7 2.9 1 4.7 1 1.8 0 3.4-0.3 4.7-1 1.4-0.7 2.5-1.6 3.4-2.7 0.9-1.1 1.6-2.4 2.1-3.8 0.5-1.4 0.7-2.9 0.7-4.3ZM155.5 65.5l0-25.2c0-1.3-0.1-2.5-0.3-3.7 -0.2-1.2-0.6-2.2-1.1-3.1 -0.5-0.9-1.2-1.6-2.1-2.1 -0.9-0.5-2-0.8-3.4-0.8 -1.4 0-2.5 0.3-3.6 0.8 -1 0.5-1.9 1.2-2.5 2.2 -0.7 0.9-1.2 2-1.5 3.2 -0.3 1.2-0.5 2.5-0.5 3.7l0 25 -15.2 0 0-46.1 14.7 0 0 6.4 0.2 0c0.6-1 1.3-2 2.2-2.9 0.9-1 1.9-1.8 3.1-2.5 1.2-0.7 2.5-1.2 3.9-1.7 1.4-0.4 2.9-0.6 4.5-0.6 3.1 0 5.7 0.6 7.9 1.7 2.2 1.1 3.9 2.5 5.2 4.3 1.3 1.8 2.3 3.8 2.9 6.1 0.6 2.3 0.9 4.6 0.9 6.8l0 28.5 -15.2 0ZM212.1 37.2c0-2.4-0.8-4.5-2.3-6.2 -1.5-1.7-3.8-2.6-6.8-2.6 -1.5 0-2.8 0.2-4.1 0.7 -1.2 0.5-2.3 1.1-3.2 1.9 -0.9 0.8-1.7 1.7-2.2 2.8 -0.6 1.1-0.9 2.2-0.9 3.4l19.5 0ZM226 43c0 0.6 0 1.2 0 1.9 0 0.6 0 1.2-0.1 1.8l-33.3 0c0.1 1.3 0.5 2.5 1.2 3.5 0.6 1 1.5 2 2.5 2.7 1 0.8 2.2 1.4 3.4 1.8 1.3 0.4 2.6 0.6 3.9 0.6 2.4 0 4.4-0.4 6.1-1.3 1.7-0.9 3-2.1 4.1-3.5l10.5 6.7c-2.2 3.1-5 5.6-8.5 7.3 -3.5 1.7-7.6 2.5-12.3 2.5 -3.4 0-6.7-0.5-9.8-1.6 -3.1-1.1-5.8-2.7-8.1-4.7 -2.3-2.1-4.1-4.6-5.4-7.6 -1.3-3-2-6.5-2-10.4 0-3.8 0.6-7.2 1.9-10.2 1.3-3.1 3-5.6 5.3-7.8 2.2-2.1 4.8-3.8 7.9-5 3-1.2 6.3-1.8 9.8-1.8 3.4 0 6.5 0.6 9.3 1.7 2.8 1.1 5.3 2.8 7.3 5 2 2.2 3.6 4.8 4.8 7.9 1.1 3.1 1.7 6.6 1.7 10.6Z" fill="#000"/></svg>'
  
  self.view = document.getElementById('view-tables')
  self.views = []
  self.title = document.getElementById('view-title')
  self.activeView = null
  self.activeTable = null
  self.activeTableOrders = document.getElementById('active-table-orders')
  self.selectTabEvents = []
  self.buttons = {
    addOrder: document.getElementById('add-order-button'),
    addToOrders: document.getElementById('add-to-orders-button'),
    markAsFree: document.getElementById('mark-as-free-button'),
    toggleLHM: document.getElementById('toggle-left-handed-mode-button')
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
    
    self.title.innerHTML = self.DONE_LOGO_HTML
    
    triggerSelectTabEvents(newView.id)
    
    self.activeView = newView
    
    history.pushState('', document.title, location.pathname)
  }
  
  window.addEventListener('hashchange', function () {
    self.openTabById(location.hash.slice(1))
  })
  
  self.title.innerHTML = self.DONE_LOGO_HTML
  
  return self
  
}())