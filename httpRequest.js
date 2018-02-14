const {Readable} = require('stream');

class HttpRequest extends Readable{

  constructor(options){
    super(options)
    this.socket = options.socket;
    this.bodyChunk = '';
  }

  setHeaders(headers){
    this.headers = headers;
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
