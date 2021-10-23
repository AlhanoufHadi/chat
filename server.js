// use express
const express = require("express");
//create instance of express
const app = express();
//use http with instance of express
const http = require("http").createServer(app);
// create socket instance with http
const io = require("socket.io")(http);
const mysql = require("mysql");

// create connection
var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "web_chat"
});
connection.connect(function (error) {
    // show error, if any
});
io.on('connection', (socket) => {
    console.log('User connected',socket.id)
    socket.on('message', (msg) => {
        console.log('Client says', msg);
       socket.broadcast.emit('message', msg);
      connection.query("INSERT INTO messages(user, message) VALUES('" + msg.user + "', '" + msg.message + "')", function (error, result) {
    });
    })
})
app.get("/", function(request, result){
    result.sendFile(__dirname + '/index.html');
});

//start the server
const PORT = process.env.PORT || 3000
http.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})

app.use(express.static(__dirname + '/public'))
// add headers
app.use(function (request, result, next) {
    result.setHeader("Access-Control-Allow-Origin", "*");
    next();
});

// create API for get_message
app.get("/get_messages", function (request, result) {
    connection.query("SELECT * FROM messages", function (error, messages) {
        // return data will be in JSON format
        result.end(JSON.stringify(messages));
    });
});



