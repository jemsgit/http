const http = require('./http');
const fs = require('fs');
const portNumber = process.argv[2] ? parseInt(process.argv[2], 10) : 8084;

const server = http.createServer();
server.listen(portNumber);

server.on('request', (request, response)=>{
    if(request.headers.Type === 'GET'){
        let path = request.headers.Path.slice(1);
        if(path.indexOf('.html') > -1){
          console.log('here');
          fs.access(path, fs.constants.R_OK, (err) => {
            console.log(err);
            if(!err){
                response.pipe(fs.open(path));
            } else {
                
            }
          })
        }
    }
    request.on('data', (data)=>{
        console.log(data);
    })

})
