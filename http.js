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

      let headersChunks = [];
      let response = new HttpResponse({socket});
      let request = new HttpRequest({socket});

      let headersCallback = (data) => {
          this.processRequestHeaders(data, headersChunks, (result)=>{
            socket.pause();
            socket.removeListener('data', headersCallback);
            request.setHeaders(result.headers);
            request.subscribeOnData();
            socket.resume();
            request.unshift(result.body);
            this.emitter.emit('request', request, response);

          });
      }

      socket.on('data', headersCallback);
    });
  }

  listen(port){
    if(Number.isInteger(port)){
      this.port = port;
    }
    this.server.listen(this.port);
  }


  processRequestHeaders(data, chunks, endHeadersCallback){
    chunks.push(data.toString('utf8'))
    let headers = chunks.join('');
    if(headers.indexOf('\r\n\r\n') > -1){
        let result = headers.split('\r\n\r\n');
        endHeadersCallback({headers: this.parseHeaders(result[0]), body: result[1]});
    }
  }

  parseHeaders(headersString){
    if(!headersString){
      return null;
    }
    let headers = {}
    let parts = headersString.split('\r\n');
    let [Type, Path, Protocol] = parts[0].split(/\s+/g);
    headers = {
      ...headers,
      Type,
      Path,
      Protocol
    }
    parts.shift(1);
    parts.forEach((val)=>{
      let delimeterIndex = val.indexOf(':');
      headers[val.slice(0, delimeterIndex)] = val.slice(delimeterIndex + 1).trim();
    })
    return headers;
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
