function SSEConnection(response)
{
    var self = this;
    this.res = response;
    this.send=function(st){
        self.res.write("id:"+new Date().getTime()+"\ndata: "+st+"\n\n","utf8");
    };
    this.sendJSON = function(obj)
    {
        self.send(JSON.stringify(obj));
    }
}

function SSE()
{
    var self = this;
    var testing = false;

    this.connections = [];
    this.addCon = function(res)
    {
        try{
            res.setHeader('Content-Type', 'text/event-stream');
            res.writeHead(200,{
                'Connection':"keep-alive",
                'Content-Type': 'text/event-stream',
                'Transfer-Encoding': 'chunked',
                'X-Content-Type-Options': 'nosniff'
            });
            res.flushHeaders({
                'Connection':"keep-alive",
                'Content-Type': 'text/event-stream',
                'Transfer-Encoding': 'chunked',
                'X-Content-Type-Options': 'nosniff'
            });
        }catch(e){}
        var se = new SSEConnection(res);
        self.connections.push(se);
        return se;
    };
    this.broadcast = function(st)
    {
        var c = self.connections;
        for(var i = c.length; --i>=0;)
        {
            try{
                c[i].send(st);
            }catch(e){};
        }
    };
    this.broadcastJSON = function(obj)
    {
        self.broadcast(JSON.stringify(obj));
    };
    this.testmode=function(bool)
    {
        if(testing==false)
        {
            testing=true;
            tst();
        }
        else if(testing)
        {
            testing=false;
        }
    };
    var tst = function()
    {
        if(testing)
        {
            self.broadcast(JSON.stringify({time:new Date()+""}));
            setTimeout(tst,3000);
        }
    }
    }

module.exports=SSE;