// ==========
// = Tables =
// ==========

Done.getTables(function (action, type, data) {
  vc.view.innerHTML = ''
  
  data.tables.forEach(function (x) {
    var element  = document.createElement('div')
    var contents = document.createElement('div')
    
    element.id = `table-${x.id}`
    element.dataset.id = x.id
    element.classList.add('table')
    contents.classList.add('table-contents')
    
    if (x.isFree)    { element.classList.add('table-free') }
    if (x.isPayed)   { element.classList.add('table-payed') }
    if (x.isWaiting) { element.classList.add('table-waiting') }
    
    contents.innerHTML = x.name
    
    element.addEventListener('click', function () {
      vc.activeTable = new Table(parseInt(x.id, 36), x.name)
      vc.openTabById('view-table', true)
    })
    
    element.appendChild(contents)
    vc.view.appendChild(element)
  })
})

// ===================
// = Order Interface =
// ===================

vc.buttons.addOrder.addEventListener('click', function () {
  vc.openTabById('view-add-order', true)
})

var fuzzyMatch = function (hay, query) {
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
  input.addEventListener('input', function () {
    var query = this.value
    var suggestionNodes = listNode.getElementsByClassName('suggestion')
    var items = []
    for (var i = suggestionNodes.length - 1; i >= 0; i -= 1) {
      items.push(suggestionNodes[i])
    }
    
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

var updateSuggestions = function (input, listNode, datalist) {
  listNode.innerHTML = ''
  
  datalist.forEach(function (x) {
    var suggestion = document.createElement('li')
  
    suggestion.innerHTML = x.name
    suggestion.dataset.value = x.name
    suggestion.classList.add('suggestion')
    
    suggestion.addEventListener('click', function () {
      input.value = suggestion.dataset.value
      
      setTimeout(function () {
        input.select()
      }, 10)
    })
    
    listNode.appendChild(suggestion)
  })
}

initFilter(vc.inputs.order, vc.suggestions.order)
initFilter(vc.inputs.extras, vc.suggestions.extras)

Done.getOrderable(function (action, type, orders) {
  updateSuggestions(vc.inputs.order, vc.suggestions.order, orders)
})

Done.getExtras(function (action, type, extras) {
  updateSuggestions(vc.inputs.extras, vc.suggestions.extras, extras)
})

// ============
// = Settings =
// ============

document.getElementById('toggle-left-handed-mode-button').addEventListener('click', function () {
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