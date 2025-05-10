const sendMail = require("../utils/sendEmail");
const User = require("../models/user");
const OTPModel = require("../models/Otp");

exports.sendMailToUser = async (req, res) => {
      const { emails, subject, message } = req.body;

      if (!emails || !Array.isArray(emails) || emails.length === 0 || !subject || !message) {
            return res.status(400).json({ message: "Missing fields" });
      }

      try {
            for (const email of emails) {
                  await sendMail(email, subject, message);
            }

            return res.status(200).json({ message: " Emails sent successfully" });
      } catch (err) {
            console.error("Email error:", err);
            return res.status(500).json({ message: " Failed to send emails" });
      }
};

exports.sendMailToAll = async (req, res) => {
      const { subject, message } = req.body;
      try {
            const users = await User.find({ role: "user" });
            const emails = users.map((u) => u.email);
            console.log(emails);
            
            for (const email of emails) {
                  await sendMail(email, subject, `<p>${message}</p>`);
            }

            res.json({ message: "Emails sent to all users" });
      } catch (err) {
            res.status(500).json({ message: "Failed", error: err.message });
      }
};

exports.verifyOTP = async (req, res) => {
      const { email, otp } = req.body;
      const found = await OTPModel.findOne({ email, otp });
      if (!found) return res.status(400).json({ message: 'Invalid OTP' });
    
      await OTPModel.deleteMany({ email });
      res.json({ success: true, message: 'OTP Verified' });
};

exports.sendOTP = async (req, res) => {
      const { email } = req.body;
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      console.log(email);
      
      await OTPModel.create({ email, otp });
      const subject = 'Your OTP Code';
      const text = `Your OTP code is ${otp}. It is valid for 5 minutes.`;
      await sendMail(email,  subject, text);
      res.json({ success: true, message: 'OTP sent to email' });
};

