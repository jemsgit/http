const { Socket } = require('net');

const req = Buffer.from('POST / HTTP/1.1\r\nHost: 127.0.0.1:8082\r\nUser-Agent: curl/7.55.1\r\nAccept: */*\r\nContent-Length: 29\r\nContent-Type: application/x-www-form-urlencoded\r\n\r\nbirthyear=190566&press=%20OK%20');
let pos = 0;
const s = new Socket();
s.connect('8084');
s.on('data', (data)=>{
  console.log('data');
  console.log(data);
})

function writeData(){
  chunk = req.slice(pos, pos+3);
  pos+=3;
  if(pos < req.length){
    s.write(chunk);
    console.log(chunk.toString());
  }
}

setInterval(writeData, 100);
