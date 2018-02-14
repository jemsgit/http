const http = require('./http');
const portNumber = process.argv[2] ? parseInt(process.argv[2], 10) : 8084;

const server = http.createServer();
server.listen(portNumber);

server.on('request', (request, response)=>{
  console.log('on request');
  setTimeout(function(){
      request.on('data', (data)=>{
        console.log('req data');
        console.log(data);
      })
  }, 2000)

})
