const jwt = require('jsonwebtoken')
const User = require('../models/User')

const protect = async(req,res,next) => {
    // console.log("my secret is:", process.env.JWT_SECRET);
    let token;

    //1.check if the "Authorization" header exists and starts with "bearer"
    // the standard token is: "Bearer <token>"
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try{
            // getting the token from the hearder (" Remove the word bearer")
            token = req.headers.authorization.split(' ')[1];
            console.log("token recieved",token)

            // verifying the token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // find the user in the DB and attach them to the request
            // (-password means "don't give me the password field")
            req.user = await User.findById(decoded.id).select('-password');

            //letting them pass to the next step
            next();
        }catch(error){
            console.error(error);
          return  res.status(401).json({
                message: 'not authorized, Token failed'
            })
        }
    }
    if(!token){
        return res.status(401).json({
        message: 'Not authorized, no Token'
        })
    }
}

module.exports = {protect};





// server/middleware/authMiddleware.js





// const jwt = require('jsonwebtoken');
// const User = require('../models/User');

// const protect = async (req, res, next) => {
//   let token;

//   if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
//     try {
//       // Get token from header
//       token = req.headers.authorization.split(' ')[1];

//       // DEBUG: Let's see what the server actually got
//       console.log("Token received:", token); 

//       // Verify token
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);

//       // Get user from the token
//       req.user = await User.findById(decoded.id).select('-password');

//       next(); // Move to the controller
//     } catch (error) {
//       console.error(error);
//       // Added 'return' to stop execution here
//       return res.status(401).json({ message: 'Not authorized, token failed' });
//     }
//   }

//   // If no token was found at all
//   if (!token) {
//     // Added 'return' to prevent double-response error
//     return res.status(401).json({ message: 'Not authorized, no token' });
//   }
// };

// module.exports = { protect };
