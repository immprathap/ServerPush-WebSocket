var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var prompt = require('prompt'); //https://www.npmjs.com/package/prompt

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
  //io.emit('chat message', "Socket connection established!");
});

http.listen(port, function(){
  console.log('Socket client listening on *:' + port);
});

broadcastToClients = function (message) {
  io.emit('chat message',message);
};

promptForInput();

// go into loop where user can provide input
var timeToExit = false;

var allInput = [];

function promptForInput() {
    prompt.get(['yourInput'], function (err, result) {
        // 
        // Log the results. 
        // 
        console.log('Your Input:' + result.yourInput);
        // send input to function that forwards it to all SSE clients
        broadcastToClients(result.yourInput);
        timeToExit = ('exit' == result.yourInput)
        if (timeToExit) {
            wrapItUp();
        }
        else {
            allInput.push(result.yourInput);
            promptForInput();
        }
    });
}

function wrapItUp() {
    console.log('It was nice talking to you. Goodbye!');
    // final recap of the dialog:
    console.log("All your input:\n " + JSON.stringify(allInput));
}
