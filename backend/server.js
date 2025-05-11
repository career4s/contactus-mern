const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');  // Add axios for external API request

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Create transporter (same as before)
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587, 
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error('SMTP connection failed:', error);
  } else {
    console.log('SMTP server is ready to send messages');
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// POST endpoint for handling contact form
app.post('/api/contact', async (req, res) => {
  const { name, email, message, recaptchaToken } = req.body;

  try {
    // Step 1: Verify the reCAPTCHA response with Google's API
  const recaptchaUrl = `https://www.google.com/recaptcha/api/siteverify`;
  const recaptchaResponse = await axios.post(recaptchaUrl, null, {
    params: {
      secret: RECAPTCHA_SECRET_KEY,
      response: recaptcha, // The response token sent from the client
    },
  });
    // Step 2: Check if reCAPTCHA verification was successful
  if (!recaptchaResponse.data.success) {
    return res.status(400).json({ success: false, message: 'reCAPTCHA verification failed.' });
  }

    // Step 2: Send email if reCAPTCHA is successful
    const mailOptions = {
      from: email,
      to: process.env.EMAIL_USER,
      subject: `New Contact Us Message from ${name}`,
      text: message,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Message sent successfully!' });

  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
