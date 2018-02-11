const {Writable} = require('stream');

class HttpResponse extends Writable{

  constructor(options){
    super(options)
  }

  _wite(){
    console.log('reead')
  }

}
module.exports = HttpResponse;
