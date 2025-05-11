import React, { useState } from 'react';
import axios from 'axios';

const ContactForm = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');
  const [recaptchaValue, setRecaptchaValue] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRecaptchaChange = (value) => {
    setRecaptchaValue(value); // Set the value when reCAPTCHA is solved
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!recaptchaValue) {
      setStatus('Please complete the reCAPTCHA.');
      return;
    }
  
    setStatus('Sending...');
    try {
      // Send form data along with reCAPTCHA response to the server
      const response = await axios.post('http://localhost:5000/api/contact', {
        ...form,
        recaptcha: recaptchaValue, // Include the reCAPTCHA response here
      });
  
      // Check response status from server
      if (response.data.success) {
        setStatus('Message sent successfully!');
        setForm({ name: '', email: '', message: '' });
      } else {
        setStatus('reCAPTCHA verification failed.');
      }
    } catch (err) {
      console.error(err);
      setStatus('Failed to send message.');
    }
  };
  

  return (
    <div>
      <h2>Contact Us</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Your name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <br />
        <input
          type="email"
          name="email"
          placeholder="Your email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <br />
        <textarea
          name="message"
          placeholder="Your message"
          value={form.message}
          onChange={handleChange}
          required
        />
        <br />
        
        <div className="g-recaptcha" 
             data-sitekey="6LeeZS0rAAAAAB8BUiXJhWYsHg9D8P7mAsUhLbEW" 
             data-callback={handleRecaptchaChange}>
        </div>
        
        <button type="submit" disabled={!recaptchaValue}>Send</button>
      </form>

      <script src="https://www.google.com/recaptcha/api.js" async defer></script>

      <p>{status}</p>
    </div>
  );
};

export default ContactForm;
