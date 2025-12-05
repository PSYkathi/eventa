// server/controllers/employeeController.js
const User = require('../models/User');
const Invitation = require('../models/invitation');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// @desc    Invite a new employee
// @route   POST /api/employees/invite
// @access  Private (Organizer Only)
const inviteEmployee = async (req, res) => {
  try {
    const { email, specialization } = req.body;

    // 1. Check if this person is already registered
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User is already registered on Eventa.' });
    }

    // 2. Generate Golden Ticket (Random Token)
    const token = crypto.randomBytes(20).toString('hex');

    // 3. Save Invitation to DB
    await Invitation.create({
      sender: req.user._id, // The logged-in Organizer
      email,
      specialization,
      token
    });

    // 4. Configure Email Sender (Using Ethereal for Testing)
    // In production, we will replace this with your Gmail
    const testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    // 5. Send the Email
    // The link points to your Frontend (we will build this page later)
    const inviteLink = `http://localhost:3000/join-team?token=${token}`;

    const info = await transporter.sendMail({
      from: '"Eventa App" <no-reply@eventa.com>',
      to: email,
      subject: `You are invited to join ${req.user.companyName || 'a Team'}!`,
      text: `Hello! You have been invited to join as a ${specialization}. Click here: ${inviteLink}`,
      html: `<h3>You have a Job Offer!</h3>
             <p>The organizer <b>${req.user.companyName}</b> wants to hire you as a <b>${specialization}</b>.</p>
             <p>Click the link below to accept:</p>
             <a href="${inviteLink}">Accept Invitation</a>`
    });

    console.log("Message sent: %s", info.messageId);
    // Preview URL allows you to see the email in browser without sending it effectively
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    res.status(201).json({ 
      message: `Invitation sent to ${email}`,
      previewLink: nodemailer.getTestMessageUrl(info) // We send this back so you can check it
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};






// @desc    Register a new employee using the Invite Token
// @route   POST /api/employees/join
// @access  Public (Anyone with the token can join)
const registerInvitedEmployee = async (req, res) => {
  try {
    const { token, name, password, phone, bio } = req.body;

    // 1. Find the Invitation
    const invitation = await Invitation.findOne({ token, status: 'Pending' });

    if (!invitation) {
      return res.status(400).json({ message: 'Invalid or Expired Invitation Token' });
    }

    // 2. Check if email is already taken (Double check)
    const userExists = await User.findOne({ email: invitation.email });
    if (userExists) {
      return res.status(400).json({ message: 'User already registered' });
    }

    // 3. Encrypt Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Create the User (Employee)
    const user = await User.create({
      name,
      email: invitation.email, // Use email from the invite
      password: hashedPassword,
      role: 'employee',
      specialization: [invitation.specialization], // Use role from invite
      phoneNumber: phone,
      bio: bio || '',
      employerId: invitation.sender, // <--- MAGIC LINK to the Boss
      isVerified: true // Employees are verified by their Boss
    });

    // 5. Burn the Ticket (Mark as Accepted)
    invitation.status = 'Accepted';
    await invitation.save();

    // 6. Generate Login Token (So they are logged in instantly)
    const loginToken = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: loginToken,
      message: "Welcome to the Team! 🤝"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { inviteEmployee, registerInvitedEmployee };
