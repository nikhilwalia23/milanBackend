//Packages Import
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyparser = require('body-parser');


//Routes Imported from other Files
const authRoutes = require('./Routes/auth');
const postRoutes = require('./Routes/post');
var mongoose = require("mongoose");
const app = express();
const PORT=8888;


//Data Base Connection
mongoose.connect(process.env.MONGO_CLUSTER).then(res => console.log("Database Connected")).
  catch(err => console.log(err));

//App all Routes

//Necessary Middleware Packages
app.use(bodyparser.json());

//Used Routes
app.use('/backendapi',authRoutes);
app.use('/backendapi',postRoutes);



app.get('/',(req,res) => 
{
    return res.status(200).json({"Message":"Working Fine"});
});
app.listen(process.env.PORT,()=> 
{
    console.log(`App is Running at PORT ${process.env.PORT}`);
});