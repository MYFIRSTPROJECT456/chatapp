var app = require('express')();

var http = require("http").Server(app);
var io = require("socket.io")(http);
// var ioc = require("socket.io-client");
var noOfUsers = [];
var onlineuser = [];
app.get('/', function(req, res){
    res.sendFile(__dirname+"/index.html");
});

io.on('connection', function(socket){
    noOfUsers.push(socket);
    console.log("added new users "+noOfUsers.length);
    socket.on("disconnect", function(sock){
        console.log('08', onlineuser);
        disData(onlineuser);
        // socket.emit("disConnect", onlineuser);
        noOfUsers.splice(noOfUsers.indexOf(sock), 1)
        onlineuser.splice(onlineuser.indexOf(sock.username), 1)
        console.log('09', onlineuser);
        
        console.log("user disconnected "+noOfUsers.length, onlineuser.splice(onlineuser.indexOf(sock.username), 1));
    });
    function disData(onlineuser){
        console.log('12');
        socket.emit("disConnect", onlineuser);
    }

    socket.on("new user", function(data){
        socket.username = data;
        // console.log('01', socket.username);
        onlineuser.push(socket.username);
        updateusers();
    });

    socket.on('msg', function(usrename, msg){
        var data = {
            name:usrename, 
            msg:msg
        }
        io.sockets.emit("rmsg", data);
    });

function updateusers(){
        io.sockets.emit("get user",onlineuser);
}

});

http.listen(1234, function(){
    console.log('app listen on port 1234');
});