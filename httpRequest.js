const {Readable} = require('stream');

class HttpRequest extends Readable{

  constructor(options){
    super(options)
    this.socket = options.socket;
  }

  setHeaders(headers){
    this.headers = headers;
  }

  subscribeOnData(){
    this.socket.on('data', (data)=>{
      console.log('data');
      console.log(data.toString('utf8'));
      this.bodyChunk = data.toString('utf8');
    })
  }

  _read(){
    console.log('read');
    console.log(this.bodyChunk);
    this.push(this.bodyChunk);
  }

}

module.exports = HttpRequest;
