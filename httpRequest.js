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
  }

  subscribeOnData(){
    this.socket.on('data', (data)=>{
      this.bodyChunk = data.toString('utf8');
      this.push(this.bodyChunk.toString('uft8'));
    })
  }

  _read(){
  }

}

module.exports = HttpRequest;
