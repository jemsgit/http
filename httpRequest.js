const {Duplex} = require('stream');

class HttpRequest extends Duplex{

  constructor(options){
    super(options)
  }

  _read(){
    console.log('reead')
  }

  _write(){

  }

}

module.exports = HttpRequest;
