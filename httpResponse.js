const { Writable } = require('stream');
const { STATUS_CODES } = require('http');

class HttpResponse extends Writable{

  constructor(options){
    super(options);
    this.socket = options.socket;
    this.defaultStatus = 200;
    this.headers = {};
    this.flushed = false;
  }

  _write(data){
    if(!this.flushed){
      this.writeHead();
    }
    this.socket.write(data, 'utf8', ()=>{});
  }

  setHeader(headerName, value){
    if(this.flushed){
      throw new Error('Response has flushed');
    } else {
      this.headers[headerName] = value;
    }
  }

  writeHead(){
    this.socket.write(this.convertHeaders());
    this.flushed = true;
  }

  convertHeaders(){
    var status = this.status || this.defaultStatus;
    var header = 'HTTP/1.1 ' + status + ' ' + STATUS_CODES[status] + '\r\n';
    for (var k in this.headers) {
       header += k + ': ' + this.headers[k] + '\r\n';
    }
    return header + '\r\n';
  }


  setStatus(code){
    if(this.flushed){
      throw new Error('Response has flushed');
    } else {
      this.status = code;
    }
  }

  end(){
    this.socket.end();
  }

}
module.exports = HttpResponse;
