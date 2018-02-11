const net = require('net')
const EventEmmitter = require('events');
const {EOL} = require('os')
const HttpRequest = require('./httpRequest');
const HttpResponse = require('./httpResponse');


class HttpServer {

  constructor(options){
    this.port = 8080;
    this.emitter = new EventEmmitter();
    this.server = net.createServer((c) => {
      console.log('client connected');
      c.on('end', () => {
        console.log('client disconnected');
      });

      let headersLoaded = false;
      let headersChunks = [];
      let requestDataChunks = [];

      let request = new HttpRequest();
      let response = new HttpResponse()

      c.on('data', (data) => {
        if(!headersLoaded){
          this.processRequestHeaders(data, headersChunks, (headers)=>{
            headersLoaded = true;
            request.headers = headers;
            this.emitter.emit('request', request, response)
          });
        } else {
          c.pipe(request)
        }
      });

      c.on('end', ()=>{
        console.log('end');
      })
      c.write('hello\r\n');
      c.pipe(c);
    });
  }

  listen(port){
    if(Number.isInteger(port)){
      this.port = port
    }
    this.server.listen(this.port);
    console.log(this.port)
  }


  processRequestHeaders(data, chunks, endHeadersCallback){
    chunks.push(data.toString('utf8'))
    let headers = chunks.join('');
    if(headers.indexOf('\r\n\r\n') > -1 || headers.indexOf(EOL+EOL) > -1){
        endHeadersCallback(headers);
    }
  }

  on(eventType, callback){
    this.emitter.on(eventType, callback)
  }
}

module.exports = {
  createServer(){
    return new HttpServer();
  }
}
