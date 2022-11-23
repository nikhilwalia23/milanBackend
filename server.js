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
var mongoose = require("mongoose");


//Import Socketio Listners
const registerroomhandlers = require("./Controllers/Chatting/Socket_helper/room.js");

let onConnection = (socket) => {
  console.log(`a user connected ${socket.id}`);


  registerroomhandlers(io,socket);
  //Join all the Subscribed Room
  //Retrive All Unseen Message From Database and Send
  socket.on('unseen_message',(id,token)=> 
  {
      //verfiy token
      if(validate(id,token))
      {
        console.log("User Validated");
      }
      else
      {
        console.log("Invalid Token");
      }
  });

  //Send New Message




  //Remove From All The Joined Rooms
  socket.on('disconnect',() => 
  {
    console.log(`a user disconnected ${socket.id}`);
  });
}

io.on('connection',onConnection);

//Data Base Connection
mongoose.connect(process.env.MONGO_CLUSTER).then(res => console.log("Database Connected")).
  catch(err => console.log(err));

//App all Routes

//Necessary Middleware Packages
app.use(bodyparser.json());

//Used Routes
app.use('/backendapi',authRoutes);
app.use('/backendapi',postRoutes);
app.use('/backendapi',matchRoutes);


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