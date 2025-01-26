const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const User = require("../models/User");

const signup = async (req, res, next) => {
  // const email_ent = await User.findOne({email});

  try {
    const { username, email, tel, password } = req.body;

    if (!username || !email || !password) {
      return res.status(404).json({ message: "All fields are required" });
    }

    let email_ent = await User.findOne({ email });

    if (email_ent) {
      return res.status(400).json({
        status: false,
        message: "Email already exists, please login",
      });
    }

    const hashedpassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      // tel,
      password: hashedpassword,
      role: "user",
    });

    await newUser.save();
    res.status(201).json({ message: "Signup successful!" });
  } catch (err) {
    console.error(`Failed to create user : ${err}`);
    next(err);
  }
};

const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ emailMessage: "User not found" });
    }

    const checkpassword = await bcrypt.compare(password, user.password);

    if (!checkpassword) {
      return res.status(400).json({ passwordMessage: "Incorrect password" });
    }
    console.log("Password Match: ", checkpassword);

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.SECRETKEY,
      { expiresIn: "1h" }
    );

    const username = user ? user.username : "";

    res.json({ token, message: "Login successful!", username });
  } catch (err) {
    console.log(`Error while trying to login : ${err}`);
    next(err);
  }
};

const forgot_password = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const resetToken = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "15m",
    });

    // Send email with reset link (example using nodemailer)
    const transporter = nodemailer.createTransport({
      service: "gmail", // or your email service provider
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    const resetUrl = `http://localhost:5173/reset-password?token=${resetToken}`;
    const mailOptions = {
      to: email,
      subject: "Password Reset",
      html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. The link expires in 15 minutes.</p>`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Reset link sent to your email." });
  } catch (error) {
    res.status(500).json({ message: "Error sending reset link." });
    next(error);
  }
};

const reset_password = async (req, res, next) => {
  const { token } = req.params; // Get token from URL
  const { password } = req.body; // Get password from request body
  if (!token) {
    return res.status(400).json({ message: "Token is required" });
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findById(decoded.id); //maybe _id
    if (!user) return res.status(404).json({ message: "User not found" });

    user.password = await bcrypt.hash(password, 10);
    await user.save();

    res.status(200).json({ message: "Password reset successfully." });
  } catch (error) {
    res.status(400).json({ message: "Invalid or expired token." });
    next(error);
  }
};

module.exports = {
  signup,
  signin,
  forgot_password,
  reset_password
};
