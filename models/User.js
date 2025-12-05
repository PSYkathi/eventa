//  server/modules/User.js


// const mongoose = require("mongoose");

// const UserSchema = new mongoose.Schema({
//     //  authentication info
//     name:{
//         type: String,
//         required: true,
//     },
//     email:{
//         type: String,
//         required: true,
//         unique: true,       //      ensures no duplicate email
//     },
//     password:{
//         type: String,
//         required: true,
//     },
//     role:{
//         type: String,
//         enum: ['user','organizer','admin','employee'], //  at first there was only the first three, but then i included 'employee' due to my will.
//         default:'user',
//     },
//     //  basic info

//     phoneNumber:{
//         type:String,
//         default:'',
//     },
//     city:{
//         type:String,
//         default:'',
//     },

//     profilePicture:{
//         type:String,
//         default:'',
//     },
//     //  organizers and employees details
//     // CHANGED: Now an Array [] so they can list MULTIPLE services/skills
//     // e.g., ["Photography", "Videography"] or ["Weddings", "Catering"]


//     specialization:[{
//         type:String
//     }],

//     //  bio

//     bio:{
//         type:String,
//         default:'',
//     },

    
//     // Portfolio Images (Array of image URLs)
//     portfolio:[{
//         type:String
//     }],

//     //  reputation system
//     averageRating:{
//         type: Number,
//         default: 0,
//     },
//     totalreviews:{
//         type:Number,
//         default:0,
//     },

//     //  business logic(organizers only)
//     campanyName:{
//         type:String,
//         default:'',
//     },

//     //  SECURITY FEATURES THAT PREVENTS FROM FAKE COMPANIES
//     isVarified:{
//         type:Boolean,
//         default:false,
//     },

//     // employee logic(employee only)
//     //  links employee to their head 

//     employerId:{
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User',
//         default: null
//     },

//     //time stamps
//     createdAt:{
//         type:Date,
//         default:Date.now,
//     },
// })

// module.exports = mongoose.model('User',UserSchema)











// server/models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  // ==========================================
  // 1. AUTHENTICATION & BASIC IDENTITY
  // ==========================================
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  
  role: {
    type: String,
    enum: ['user', 'organizer', 'admin', 'employee'], 
    default: 'user',
  },
  
  // New: For the "Kerala" context we discussed
  language: { 
    type: String, 
    enum: ['English', 'Malayalam'], 
    default: 'English' 
  },

  phoneNumber: { type: String, default: '' },
  city: { type: String, default: '' }, // User's location or Organizer's HQ
  profilePicture: { type: String, default: '' }, // URL from cloud storage




  // ==========================================
  // 2. ORGANIZER: KYC & LEGAL (The "Trust" Layer)
  // ==========================================
  // Only for Organizers. Admin checks this.
  kycDetails: {
    aadharNumber: { type: String, default: '' },
    idProofImage: { type: String, default: '' }, // URL of the photo
    selfieImage: { type: String, default: '' },  // URL of the selfie
    verificationStatus: {
      type: String,
      enum: ['Pending', 'Verified', 'Rejected', 'Not_Submitted'],
      default: 'Not_Submitted'
    }
  },
  
  // Quick check for the system (True only if verificationStatus === 'Verified')
  isVerified: { type: Boolean, default: false },
  companyName: { type: String, default: '' },



  // ==========================================
  // 3. ORGANIZER: BUSINESS & SERVICES
  // ==========================================
  // What they do (e.g., ["Catering", "Decor"]) - Linked to Search
  specialization: [{ type: String }], 
  
  // Where they work (e.g., ["Kozhikode", "Wayanad", "All Kerala"])
  serviceLocation: [{ type: String }],
  
  bio: { type: String, default: '' },
  
  // The "We are Hiring" Badge
  isHiring: { type: Boolean, default: false },





  // ==========================================
  // 4. ORGANIZER: PRICING ENGINE (User Vision)
  // ==========================================
  // Standard Packages (Silver/Gold/Platinum)
  packages: [{
    name: { type: String }, // e.g., "Gold Package"
    price: { type: Number }, // e.g., 60000
    features: [{ type: String }] // e.g., ["Photo", "Video", "Album"]
  }],

  // Add-ons for the Calculator (e.g., Drone, Smoke)
  addOns: [{
    name: { type: String },
    price: { type: Number }
  }],






  // ==========================================
  // 5. EMPLOYEE: JOB DETAILS
  // ==========================================
  // Who is their boss?
  employerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  
  // The "Golden Ticket" Token (for invites)
  invitationToken: { type: String, default: '' },

  // The Deal
  salary: {
    amount: { type: Number, default: 0 },
    frequency: { type: String, enum: ['Hourly', 'Monthly', 'Per_Event'], default: 'Per_Event' }
  },




  // ==========================================
  // 6. REPUTATION & METRICS
  // ==========================================
  portfolio: [{ type: String }], // Images of past work
  averageRating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },



  
  // ==========================================
  // 7. SYSTEM DATA
  // ==========================================
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', UserSchema);
