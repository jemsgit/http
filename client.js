const { Socket } = require('net');
const { EOL } = require('os')

const req = Buffer.from('GET / HTTP/1.0' + EOL + EOL);
let pos = 0;
const s = new Socket();
s.connect('8082');


function writeData(){
  chunk = req.slice(pos, pos+1);
  pos+=1;
  if(pos < req.length){
    s.write(chunk);
    console.log(chunk.toString());
  }
}

setInterval(writeData, 200)
