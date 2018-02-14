const {Writable} = require('stream');

class HttpResponse extends Writable{

  constructor(options){
    super(options)
    this.socket = options.socket;
    this.defaultStatus = 200;
    this.headers = {};
    this.flushed = false;
  }

  _write(data){
    if(!this.flushed){
      this.writeHead();
    }
    this.socket.write(data);
  }

  setHeader(headerName, value){
    if(this.flushed){
      throw new Error('Response has flushed')
    } else {
      this.headers[headerName] = value;
    }
  }

  writeHead(){

  }


  setStatus(code){
    if(this.flushed){
      throw new Error('Response has flushed')
    } else {
      this.status = value;
    }
  }

}
module.exports = HttpResponse;
