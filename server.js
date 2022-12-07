//Packages Import
require('dotenv').config();
const express = require('express');
const { Server } = require("socket.io");
const cors = require('cors');
var http = require("http");
const bodyparser = require('body-parser');
const {validate} = require('./Controllers/auth.js')


const app = express();
app.use(cors());
const PORT=8888;
var server = http.createServer(app);
const io = new Server(server,{cors:
  {
    origin:'*',
    methods:["GET","POST"],
  }
  }
  );

//Routes Imported From other Files

const authRoutes = require('./Routes/auth');
const postRoutes = require('./Routes/post');
const matchRoutes = require('./Routes/match');
const chatRoutes = require('./Routes/chat');
const userRoutes = require('./Routes/user');


var mongoose = require("mongoose");


//Import Socketio Listners
const registerroomhandlers = require("./Controllers/Chatting/Socket_helper/room.js");
const registermessagehandlers = require("./Controllers/Chatting/Socket_helper/message");


let onConnection = (socket) => {
  console.log(`a user connected ${socket.id}`);


  registerroomhandlers(io,socket);
  registermessagehandlers(io,socket);
  //Remove From All The Joined Rooms
  socket.on('disconnect',() => 
  {
    console.log(`a user disconnected ${socket.id}`);
  });
}
io.use((socket,next) => 
{
  if(validate(socket.handshake.auth.userid,socket.handshake.auth.token))
  {
      next();
  }
  else
  {
      //If the next method is called with an Error object,
      //the connection will be refused and the client will receive an (connect_error) event
      const err = new Error("not authorized");
      err.data = { content: "Please retry later"};
      //To Do Handle connect_error Event At Frontend
      next(err); 
  }
});
io.on('connection',onConnection);

//Data Base Connection
mongoose.connect(process.env.LOCAl_MONGO_ADDRESS).then(res => console.log("Database Connected")).
  catch(err => console.log(err));

//App all Routes

//Necessary Middleware Packages
app.use(bodyparser.json());

//Used Routes
app.use('/backendapi',authRoutes);
app.use('/backendapi',postRoutes);
app.use('/backendapi',matchRoutes);
app.use('/backendapi',chatRoutes);
app.use('/backendapi',userRoutes);

app.get('/temp',(req,res) => 
{
   return res.status(200).json({"Message":"Working Fine"});
});


// app.listen(process.env.PORT,()=> 
// {
//     console.log(`App is Running at PORT ${process.env.PORT}`);
// });


server.listen(process.env.PORT,() => 
{
  console.log(`Chat Module Running in PORT ${process.env.PORT}`);
});