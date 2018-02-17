const {Readable} = require('stream');

class HttpRequest extends Readable{

  constructor(options){
    super(options)
    this.socket = options.socket;
    this.headers = null;
    this.method = null;
    this.url = null;
  }

  setHeaders(headers){
    this.headers = headers;
    if(headers && headers.Type){
      this.method = headers.Type;
      if(headers.Host && headers.Path){
        this.url = `${headers.Host}${headers.Path}`;
      }
    }
    if(headers && headers['Content-Length']){
      this.avaliadbleContent = parseInt(headers['Content-Length'], 10);
    }
  }

  subscribeOnData(){
    this.socket.on('data', (data)=>{
      this.avaliadbleContent-=data.length;
      this.bodyChunk = data;
      this.push(this.bodyChunk);
      if(this.avaliadbleContent === 0){
        this.push(null)
      }
    })
  }

  _read(){

  }

}

module.exports = HttpRequest;
