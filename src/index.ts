import * as nodemailer from 'nodemailer'; // Use named import
import express from 'express';
import bodyParser from 'body-parser';

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'mappersphere@gmail.com', // Replace with your email
        pass: 'seuyzwfhwxxdtcxh'   // Replace with your email password or app password
    }
});
// Route to handle email sending
app.post('/send-email', async (req, res) => {
    let { htmlTemplate, recipients } = req.body;

    if (!htmlTemplate || !recipients) {
        return res.status(400).json({ message: 'htmlTemplate and recipients are required' });
    }
    if (typeof recipients === 'string') {
        recipients = [recipients];
    }
    const mailOptions = {
        from: 'mappersphere@gmail.com', // Replace with your email
        to: recipients.join(', '),    // Join recipients into a single string if it's an array
        subject: 'Your Subject Here', // Customize the subject as needed
        html: htmlTemplate            // The HTML content of the email
    };
    try {
        const info = await transporter.sendMail(mailOptions);
        res.json({ message: 'Email sent', response: info.response });
    } catch (error) {
        res.status(500).json({ message: 'Error occurred', error: error.message });
    }
});
// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
