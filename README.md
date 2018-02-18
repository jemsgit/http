# http
node js task

start server through node app.js

send test requests through:
- node client.js
- curl -F 'data=@123.jpeg' http://127.0.0.1:8084
- curl -d "birthyear=1905&press=%20OK%20" http://127.0.0.1:8084 (there is a problem with catching the end of request)
