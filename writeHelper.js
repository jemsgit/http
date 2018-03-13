const {Writable} = require('stream');

class WriteHelper extends Writable{
  constructor(socket, readableStream){
    super();
    this.socket = socket;
    this.readable = readableStream;
  }

  _write(data, encoding, callback){
    this.socket.pause();
    this.readable.push(data);
    callback();
    if(this.readable.avaliadbleContent !== undefined){
        this.readable.avaliadbleContent -= data.length;
        if(this.readable.avaliadbleContent < 1){
          this.readable.push(null); //не уверен в правильности, т к поидее здесь не вызывается read после предыдущего пуша
        }
    }
  }

}

module.exports = WriteHelper;
