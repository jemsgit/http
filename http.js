const net = require('net')
const EventEmmitter = require('events');
const {EOL} = require('os')
const HttpRequest = require('./httpRequest');
const HttpResponse = require('./httpResponse');


class HttpServer {

  constructor(options){
    this.port = 8080;
    this.emitter = new EventEmmitter();
    this.server = net.createServer((socket) => {

      socket.on('end', () => {
        console.log('client disconnected');
      });

      let headersLoaded = false;
      let headersChunks = [];
      let requestDataChunks = [];
      let response = new HttpResponse()
      let request = new HttpRequest({socket});

      let headersCallback = (data) => {
          this.processRequestHeaders(data, headersChunks, (headers)=>{
            socket.pause();
            socket.removeListener('data', headersCallback);
            request.setHeaders(headers[0]);
            request.unshift(headers[1]);
            socket.resume();
            request.subscribeOnData();

            console.log('emit req');
            this.emitter.emit('request', request, response);
          });

      }

      socket.on('data', headersCallback);

      socket.on('end', (test)=>{
        console.log('end', test);
      })

      socket.write('hello\r\n');
    });
  }

  listen(port){
    if(Number.isInteger(port)){
      this.port = port
    }
    this.server.listen(this.port);
  }


  processRequestHeaders(data, chunks, endHeadersCallback){
    chunks.push(data.toString('utf8'))
    let headers = chunks.join('');
    if(headers.indexOf('\r\n\r\n') > -1){
        console.log(headers.split('\r\n\r\n'));
        endHeadersCallback(headers.split('\r\n\r\n'));
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
