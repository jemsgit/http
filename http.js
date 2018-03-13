const net = require('net')
const EventEmmitter = require('events');
const {EOL} = require('os')
const HttpRequest = require('./httpRequest');
const HttpResponse = require('./httpResponse');
const WriteHelper = require('./writeHelper');



class HttpServer {

  constructor(options){
    this.port = 8080;
    this.emitter = new EventEmmitter();
    this.headersChunks = Buffer.from([]);
    this.server = net.createServer((socket) => {

      socket.on('end', () => {
        console.log('client disconnected');
      });

      let response = new HttpResponse({socket});
      let request = new HttpRequest({socket});
      let writeHelper = new WriteHelper(socket, request);
      writeHelper.on('unpipe', (src) => {
        console.error('Something has stopped piping into the writer.');
      });

      let headersCallback = (data) => {
          this.processRequestHeaders(data, (result)=>{
            socket.pause();
            this.headersChunks = Buffer.from([]);
            socket.removeListener('data', headersCallback);
            request.setHeaders(result.headers);
            socket.unshift(result.body);
            socket.pipe(writeHelper);
            socket.resume();
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


  processRequestHeaders(data, endHeadersCallback){
    this.headersChunks = Buffer.concat([this.headersChunks, data]);
    let spacePosition = this.headersChunks.indexOf(Buffer.from([13,10,13,10]));

    if(spacePosition > -1){
        let header = this.headersChunks.slice(0, spacePosition);
        let body = this.headersChunks.slice(spacePosition+4);
        endHeadersCallback({headers: this.parseHeaders(header), body: body});
    }
  }

  parseHeaders(headerBuffer){
    if(!headerBuffer){
      return null;
    }
    let headers = {}
    let parts = headerBuffer.toString('utf8').split('\r\n');
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
