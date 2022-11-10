//Packages Import
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyparser = require('body-parser');


//Routes Imported from other Files
const authRoutes = require('./Routes/auth');

const app = express();
const PORT=8888;


//App all Routes

//Necessary Middleware Packages
app.use(bodyparser.json());

//Used Routes
app.use('/backendapi',authRoutes);



app.get('/',(req,res) => 
{
    return res.status(200).json({"Message":"Working Fine"});
});
app.listen(process.env.PORT,()=> 
{
    console.log(`App is Running at PORT ${process.env.PORT}`);
});