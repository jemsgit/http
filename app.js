const http = require('./http');
const portNumber = process.argv[2] ? parseInt(process.argv[2], 10) : 8080;

const server = http.createServer();
server.listen(portNumber);

server.on('request', (request, response)=>{
  console.log(request);
  console.log(response);
})
