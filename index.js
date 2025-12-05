// //server/index.js
// const express = require('express');
// const cors = require('cors');
// const dotenv = require('dotenv');


// //      load enironment variable

// dotenv.config()

// //      initialize the app

// const app = express();

// //      middleware(gatekeepers)
// app.use(express.json()); //  allows us to read JSON data sent from the frontend
// app.use(cors()) //  allows the frontend to communicate with us



// // a simple test route to see if the server is alive

// app.get('/',(req,res)=>{
//     res.send('eventa API is running....');
// });


// //define the port (default to 5000)

// const port = process.env.port || 5000;


// //      start the server

// app.listen(port,()=>{
//     console.log(`---------------------------------------`);
//     console.log(`server is running on port:${port}`);
//     console.log(`visit: http://localhost:${port}`);
//     console.log(`----------------------------------------`)
// })







/////////////////////////////////////////////////////////////////

const express =require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const authRoutes = require('./routes/authRoutes')   // route imported
const userRoutes = require('./routes/userRoutes')
const eventRoutes = require('./routes/eventRoutes')
const employeeRoutes = require('./routes/employeeRoutes');


//      database logic

dotenv.config();     //  1. load config
connectDB();        // 2.connect to database
const app = express()   // 3. initialize app


//  middleware
    app.use(express.json());
app.use(cors());


//  route using get
app.get('/',(req,res)=>{
    res.send(`eventa app is running.....`)
})

app.use('/api/auth',authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes)
app.use('/api/employees', employeeRoutes);


//      starting the server
const port = process.env.port || 5000;
app.listen(port,()=>{
    console.log(`the server is running ${port}`)
})
