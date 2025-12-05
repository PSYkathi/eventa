const mongoose = require('mongoose');
const connectDB = async()=>{
    try{
        // console.log("Checking Database URI:", process.env.MONGO_URI); 
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`mongoDB connected: ${conn.connection.host}`)
    }catch(error){
        console.error(`Error: ${error.message}`)
        process.exit(1);
    }
}

module.exports = connectDB