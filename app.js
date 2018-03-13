const http = require('./http');
const fs = require('fs');
const portNumber = process.argv[2] ? parseInt(process.argv[2], 10) : 8084;

const server = http.createServer();
server.listen(portNumber);

server.on('request', (request, response)=>{
    if(request.headers.Type === 'GET'){
        let path = request.headers.Path.slice(1);
        if(path.indexOf('.html') > 0){

          fs.access(__dirname+'/static/'+path, fs.constants.R_OK, (err)=>{
            if(!err){
              fs.createReadStream(__dirname+'/static/'+path).pipe(response);
            } else {
                response.setStatus(404);
                response.setHeader("Content-Type","text/plain");
                response.write('Not found');
                response.end();
            }
          });
        } else {
            response.setStatus(200);
            response.write('Hello!');
            response.end();
        }
    } else {
      request.on('data', (data)=>{
          console.log(data.toString('utf8'));
      })
      request.on('end', () => {
        response.setStatus(200);
        response.setHeader("Content-Type","text/plain");
        response.write('Hello!');
        response.end();
      });
    }


})
