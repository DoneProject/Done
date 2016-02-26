window.addEventListener("keydown",function(event){
    if(event.keyCode==123)
    {
        require('nw.gui').Window.get().showDevTools();
    }
})