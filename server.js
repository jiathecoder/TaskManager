// require the path module
var path = require("path");
// require express and create the express app
var express = require("express");
var session = require('express-session');
var app = express();

//using socket.io
var server = app.listen(process.env.PORT || 5000);
var io = require('socket.io').listen(server);
io.sockets.on('connection', function (socket) {
  console.log("WE ARE USING SOCKETS!");
  console.log('socket.id = '+socket.id);
  //all the socket code goes in here!
  socket.on('allHomes', function(){
  	console.log('allHomes emit received');
  	io.emit('allHomes',{res:'server - all homes'});
  })
  socket.on('getHome', function(){
  	console.log('getHome emit received');
  	io.emit('getHome',{res:'server - get home'});
  })
})

app.use(session({secret: 'codingdojorocks'}));
// require mongoose and create the mongoose variable

// require bodyParser since we need to handle post data for adding a user
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded());
// This goes in our server.js file so that we actually use the mongoose config file!


// This goes in our server.js file so that we actually use the mongoose config file!
app.use(express.static(path.join(__dirname, "/client")));
require('./config/mongoose.js');
require('./config/routes.js')(app);
// static content

// listen on 8000
 // app.listen(8000, function() {
 // console.log("listening on port 8000");
 // });