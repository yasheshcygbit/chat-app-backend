const express = require('express');
const { createServer } = require("http");
const { Server } = require("socket.io");
const logger = require('morgan');
const indexRouter = require('./app/api/routes');
const bodyParser = require('body-parser');
const mongoose = require('./config/database'); //database configuration
var jwt = require('jsonwebtoken');
const app = express();
var cors = require('cors')

// connection to mongodb
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(cors())

app.use(logger('dev'));
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

app.get('/', function (req, res) {
  res.json({ "tutorial": "Build REST API with node.js" });
});

app.use("/", indexRouter);

app.get('/favicon.ico', function (req, res) {
  res.sendStatus(204);
});

// express doesn't consider not found 404 as an error so we need to handle 404 explicitly
// handle 404 error
app.use(function (req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// handle errors
app.use(function (err, req, res, next) {
  console.log(err);

  if (err.status === 404)
    res.status(404).json({ message: "Not found" });
  else
    res.status(500).json({ message: "Something looks wrong :( !!!" });
});

// app.listen(3000, function () { console.log('Node server listening on port 3000'); });
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: 'http://localhost:3000' } });
io.on("connection", (socket) => {
  console.log('[SOCKET socket]', socket.id);
  socket.on("JOIN_ROOM", (arg) => {
    console.log('[SOCKET JOIN_ROOM]', arg);
    socket.join(arg.roomId);
    socket.to(arg.roomId).emit('NEW_USER', arg.user);
  });
  socket.on("NEW_MESSAGE", (arg) => {
    console.log('[SOCKET NEW_MESSAGE]', arg);
    socket.to(arg.roomId).emit('NEW_MESSAGE', arg);
  });
});

httpServer.listen(3001);