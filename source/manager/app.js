var http = require("http");
var dns = require("dns");
var fs = require("fs");
const port = 8080;


function handleApiRequest(request,response)
{
  response.end("API REQUEST!");
};

function handleRequest(request,response)
{
  
  console.log("HANDLE REQUEST: "+request.url);
  
  if(request.url.indexOf("/?")==0)
  {
    handleApiRequest(request,response);
    return;
  }
  
  if(request.url=="/" || request.url.length==0)request.url="index.html";
  if(request.url[0]=="/")request.url=request.url.replace("/","");
  
  try{
    var resp = fs.readFileSync(request.url);
    response.end(resp);
  }catch(e){
    response.end("ERROR: location "+request.url);
  }
  
};

var hserver = http.createServer(handleRequest);
hserver.listen(port,function(){
  console.log("Server listening on: http://localhost:%s", port);
});

