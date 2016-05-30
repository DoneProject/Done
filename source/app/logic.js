// ==========
// = Tables =
// ==========

var listOrders = function (orders, id) {
  orders.forEach(function (x) {
    var item = document.createElement('li')
    
    // Set Attributes
    item.className = 'order-item'
    item.dataset.orderId = id
    
    // Add Inner HTML
    item.innerHTML  = '<div class="order-name">'+ x.name + '</div>'
    item.innerHTML += '<div class="order-extras">' + x.extras.map(function (extra) {
      return extra.action + extra.name
    }).join(', ') + '</div>'
    item.innerHTML += '<button class="delete-button" onclick="deleteOrderById(\'' + id + '\')"></button>'
    
    // List Item
    vc.activeTableOrders.appendChild(item)
  })
}

/**
 * Refreshes all tables in the Done app.
 * 
 * @param tables An array of tables.
 */
var refreshTableHTML = function (tables) {
  if (!tables || typeof tables.forEach !== 'function') { return }
  
  // Clear Table View
  vc.view.innerHTML = ''  
  
  // Rebuild Table View
  tables.forEach(function (x) {
    if (vc.activeTable && vc.activeTable.id === x.id) {
      vc.activeTable = x
    }
    
    // Create Table DOM Object
    var element  = document.createElement('div')
    var contents = document.createElement('div')
    
    element.id = 'table-' + x.id
    element.dataset.id = x.id
    element.classList.add('table')
    contents.classList.add('table-contents')
    
    // Set States
    if (x.isFree)    { element.classList.add('table-free') }
    if (x.isPayed)   { element.classList.add('table-payed') }
    if (x.isWaiting) { element.classList.add('table-waiting') }
    
    contents.innerHTML = x.name
    
    // Handle Table Clicks
    element.addEventListener('click', function () {
      vc.activeTable = new Table(x.id, x.name, x.pending, x.isFree, x.isPayed, x.isWaiting, x.nr)
      
      vc.openTabById('view-table', true)
      
      vc.activeTable.pending.forEach(function (y) {
        listOrders(y.orders, vc.activeTable.pending[0].id)
      })
      
      // Toggle Mark as Free Button
      if (vc.activeTable.isFree) {
        vc.buttons.markAsFree.setAttribute('hidden', 'hidden')
      } else {
        vc.buttons.markAsFree.removeAttribute('hidden')
      }
    })
    
    // Add Tables to the Grid
    element.appendChild(contents)
    vc.view.appendChild(element)
  })
  
  // Update Active Table View
  if (vc.activeTable && vc.activeTable.pending.length > 0) {
    var orders = []
    
    vc.activeTable.pending.forEach(function (x) {
      x.orders.forEach(function (y) {
        orders.push(y)
      })
    })
    
    listOrders(orders, vc.activeTable.pending[0].id)
  }
}

// Mark Tables as Free
vc.buttons.markAsFree.addEventListener('click', function () {
  Done.markFreeById(vc.activeTable.id, refreshTableHTML)
  vc.buttons.markAsFree.setAttribute('hidden', 'hidden')
})

// Delete Orders
var deleteOrderById = function (id) {
  Done.deleteOrder(id)
}

// =====================
// = Listen For Tables =
// =====================

Done.getTables(function (action, type, data) {
  refreshTableHTML(data.tables)
})
Done.changeTable(function (action, type, data) {
  vc.activeTableOrders.innerHTML = ''
  refreshTableHTML(data.tables)
})

// ===================
// = Order Interface =
// ===================

// Open add Order Sheet
vc.buttons.addOrder.addEventListener('click', function () {
  vc.openTabById('view-add-order', true)
})

var fuzzyMatch = function (hay, query) {
  // fuzzy match strings
  hay = hay.toLowerCase()
  query = query.toLowerCase()
  
  for (var i = 0, l, n = 0; l = query[i]; i += 1) {
    if (!~(n = hay.indexOf(l, n++))) {
      return false
    }
  }
  
  return true
}

var initFilter = function (input, listNode) {
  // Listen for Input Events and Start Filtering
  input.addEventListener('input', function () {
    // Cut out Query
    var query = this.value
      .replace(/[+-]/g, '')
      .replace(/.*,\s*/, '')
    var suggestionNodes = listNode.getElementsByClassName('suggestion')
    var items = []
    
    for (var i = suggestionNodes.length - 1; i >= 0; i -= 1) {
      items.push(suggestionNodes[i])
    }
    
    // Filter Suggestions
    items.forEach(function (x) {
      var matches = fuzzyMatch(x.dataset.value, query)
      
      if (matches) {
        x.removeAttribute('hidden')
      } else {
        x.setAttribute('hidden', 'hidden')
      }
    })
  })
}

var updateSuggestions = function (input, listNode, datalist, callback) {
  listNode.innerHTML = ''
  
  // List new Suggestions
  datalist.forEach(function (x) {
    var suggestion = document.createElement('li')
    
    suggestion.innerHTML = x.name
    suggestion.dataset.value = x.name
    suggestion.classList.add('suggestion')
    
    // Invoke Callback With Decision Handler
    suggestion.addEventListener('click', function () {
      callback(input, suggestion)
    })
    
    listNode.appendChild(suggestion)
  })
}

// Register Filters
initFilter(vc.inputs.order, vc.suggestions.order)
initFilter(vc.inputs.extras, vc.suggestions.extras)

Done.getOrderable(function (action, type, orders) {
  updateSuggestions(vc.inputs.order, vc.suggestions.order, orders, function (input, suggestion) {
    // [ Foo        ] -> [ Baz        ]
    input.value = suggestion.dataset.value
    setTimeout(function () { input.select() }, 10)
  })
})

Done.getExtras(function (action, type, extras) {
  updateSuggestions(vc.inputs.extras, vc.suggestions.extras, extras, function (input, suggestion) {
    // [ +Foo       ] -> [ +Foo, +Baz ]
    var value = input.value.replace(/[^,]*$/, ' ').replace(/^\s*/, '')
    var action = (function() {
      var foo = /([+-])[^,]*$/.exec(input.value)
      
      if (foo !== null) {
        return foo[1]
      } else {
        // Ask for Confirm
        return confirm('OK: +, '+l('Cancel')+': -') ? '+' : '-'
      }
    }())
    
    input.value = value + action + suggestion.dataset.value + ', '
  })
})

// ===================
// = Order Something =
// ===================

var addToOrders = function () {
  // Create Package
  var package = {}
  // Grap Order
  var order = vc.inputs.order.value
  // Grap Extras With Action
  var extras = vc.inputs.extras.value.split(',').map(function (x) {
    return x.replace(/^\s*(.*?)\s*$/, '$1')
  }).filter(function (x) {
    return x !== ''
  }).filter(function (x) {
    return /^([+-])(.+)$/.test(x)
  }).map(function (x) {
    var parts = /^([+-])(.+)$/.exec(x)
    return { action: parts[1], name: parts[2] }
  })
  
  // Send Order With Extras to Server
  Done.postOrder(vc.activeTable.id, [{
    name: order,
    extras: extras
  }])
  
  vc.openTabById('view-table')
  
  // Clear Input
  vc.inputs.order.value = ''
  vc.inputs.extras.value = ''
  
  var suggestionNodes = document.getElementsByClassName('suggestion')
  var items = []
  
  for (var i = suggestionNodes.length - 1; i >= 0; i -= 1) {
    items.push(suggestionNodes[i])
  }
  
  items.forEach(function (x) {
    x.removeAttribute('hidden')
  })
}

vc.buttons.addToOrders.addEventListener('click', addToOrders)
vc.forms.addOrder.addEventListener('submit', function (event) {
  event.preventDefault()
  addToOrders()
})

// ============
// = Settings =
// ============

vc.buttons.toggleLHM.addEventListener('click', function () {
  vc.inLeftHandedMode = !vc.inLeftHandedMode
  
  localStorage.setItem('left-handed-mode', vc.inLeftHandedMode ? '1' : '0')
  document.body.classList.toggle('left-handed-mode')
})

if (localStorage.getItem('auth') === null) {
  document.getElementById('nav-view-settings').dataset.notification = '1'
}

document.getElementById('login-form').addEventListener('submit', function (event) {
  event.preventDefault()
  
  var username = vc.inputs.username.value
  var password = vc.inputs.password.value
  
  Done.auth(username, password)
})