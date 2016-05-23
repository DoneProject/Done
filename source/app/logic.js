// ==========
// = Tables =
// ==========

var refreshTableHTML = function (action, type, data) {
  vc.view.innerHTML = ''
  
  data.tables.forEach(function (x) {
    var element  = document.createElement('div')
    var contents = document.createElement('div')
    
    // create table object
    element.id = 'table-' + x.id
    element.dataset.id = x.id
    element.classList.add('table')
    contents.classList.add('table-contents')
    
    // set states
    if (x.isFree)    { element.classList.add('table-free') }
    if (x.isPayed)   { element.classList.add('table-payed') }
    if (x.isWaiting) { element.classList.add('table-waiting') }
    
    contents.innerHTML = x.name
    
    // handle table clicks
    element.addEventListener('click', function () {
      vc.activeTable = new Table(x.id, x.name, x.pending, x.isFree, x.isPayed, x.isWaiting, x.nr)
      vc.openTabById('view-table', true)
      
      console.log(vc.activeTable)
      
      if (vc.activeTable.isFree) {
        vc.buttons.markAsFree.setAttribute('hidden', 'hidden')
      } else {
        vc.buttons.markAsFree.removeAttribute('hidden')
      }
    })
    
    // add tables to the grid
    element.appendChild(contents)
    vc.view.appendChild(element)
  })
}

Done.getTables(refreshTableHTML)

// mark tables as free
vc.buttons.markAsFree.addEventListener('click', function () {
  Done.markFreeById(vc.activeTable.id, refreshTableHTML)
  vc.buttons.markAsFree.setAttribute('hidden', 'hidden')
})

// ===================
// = Order Interface =
// ===================

// open add order sheet
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
  // listen for input events and start filtering
  input.addEventListener('input', function () {
    // cut out query
    var query = this.value
      .replace(/[+-]/g, '')
      .replace(/.*,\s*/, '')
    var suggestionNodes = listNode.getElementsByClassName('suggestion')
    var items = []
    
    for (var i = suggestionNodes.length - 1; i >= 0; i -= 1) {
      items.push(suggestionNodes[i])
    }
    
    // filter suggestions
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
  
  // list new suggestions
  datalist.forEach(function (x) {
    var suggestion = document.createElement('li')
    
    suggestion.innerHTML = x.name
    suggestion.dataset.value = x.name
    suggestion.classList.add('suggestion')
    
    // invoke callback with decision handler
    suggestion.addEventListener('click', function () {
      callback(input, suggestion)
    })
    
    listNode.appendChild(suggestion)
  })
}

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
        return confirm('OK: +, Cancel: -') ? '+' : '-'
      }
    }())
    
    input.value = value + action + suggestion.dataset.value + ', '
  })
})

// ===================
// = Order Something =
// ===================

vc.buttons.addToOrders.addEventListener('click', function () {
  var package = {}
  var order = vc.inputs.order.value
  var extras = vc.inputs.extras.value.split(',').map(function (x) {
    return x.replace(/^\s*(.*?)\s*$/, '$1')
  }).filter(function (x) {
    return x !== ''
  })
  
  console.log(order, extras)
  
  vc.openTabById('view-table')
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