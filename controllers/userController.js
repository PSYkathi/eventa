// const User = require('../models/User')


// const updateUserProfile = async (req,res) => {
//     try{
//     // 1. Find the user (The ID comes from the Middleware guard)
//     const user = await User.findById(req.user._id);

//     if(user){
//         user.name = req.body.name || user.name;
//         user.email = req.body.email || user.email;
//         user.city = req.body.city || user.city;
//         user.phoneNumber = req.body.phoneNumber || user.phoneNumber;
//         user.bio = req.body.bio || user.bio;
//         user.specialization = req.body.specialization || user.specialization;
//         user.companyName = req.body.companyName || user.companyName;
//         user.priceRange = req.body.priceRange || user.priceRange;
        
//         // save to DB
//         const updateUser = await user.save();

//         res.json({
//             _id: updateUser._id,
//             name: updateUser.name,
//             email: updateUser.email,
//             city: updateUser.city,
//             role: updateUser.role,
//             message: "profile Updated"
//         })
//     }else{
//         res.status(404).json({
//             message: 'User Not Found'
//         })
//     }
//     }catch(error){
//         console.error(error);
//         res.status(500).json({
//             message: 'Server Error'
//         })
//     }
// }
// module.exports = {updateUserProfile};






// server/controllers/userController.js
const User = require('../models/User');

// @desc    Update User Profile (Handles EVERYTHING: KYC, Packages, Bio, etc.)
// @route   PUT /api/users/profile
// @access  Private (User & Organizer)
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      // --- 1. BASIC UPDATES (User & Organizer) ---
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.phoneNumber = req.body.phoneNumber || user.phoneNumber;
      user.city = req.body.city || user.city;
      user.language = req.body.language || user.language;
      user.profilePicture = req.body.profilePicture || user.profilePicture;

      // --- 2. ORGANIZER SPECIFIC UPDATES ---
      if (user.role === 'organizer') {
        user.companyName = req.body.companyName || user.companyName;
        user.bio = req.body.bio || user.bio;
        user.isHiring = req.body.isHiring !== undefined ? req.body.isHiring : user.isHiring;

        // Arrays (Specialization, Locations)
        // If they send a new list, we replace the old one
        if (req.body.specialization) user.specialization = req.body.specialization;
        if (req.body.serviceLocation) user.serviceLocation = req.body.serviceLocation;

        // PRICING ENGINE (The Packages)
        if (req.body.packages) user.packages = req.body.packages;
        if (req.body.addOns) user.addOns = req.body.addOns;

        // KYC DETAILS (Admin will check these)
        if (req.body.kycDetails) {
          user.kycDetails = {
            ...user.kycDetails, // Keep existing status
            ...req.body.kycDetails // Overwrite with new data
          };
          // If they update KYC, reset status to Pending so Admin sees it again
          user.kycDetails.verificationStatus = 'Pending';
        }
      }

      // --- 3. EMPLOYEE SPECIFIC UPDATES ---
      if (user.role === 'employee') {
        user.bio = req.body.bio || user.bio;
        // Employees cannot change their Salary/Employer (Only Boss can do that)
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        isVerified: updatedUser.isVerified,
        message: "Profile Updated Successfully! ✅"
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get User Profile (To show data on the dashboard)
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
}

module.exports = { updateUserProfile, getUserProfile };