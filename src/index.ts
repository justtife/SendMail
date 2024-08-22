import * as nodemailer from 'nodemailer';
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
    let { htmlTemplate, recipients, sender, attachment, cc, bcc } = req.body;

    if (!htmlTemplate || !recipients) {
        return res.status(400).json({ message: 'htmlTemplate and recipients are required' });
    }

    if (typeof recipients === 'string') {
        recipients = [recipients];
    }

    // Function to create mail options based on the recipient
    const createMailOptions = (recipient: string, isLast: boolean) => {
        return {
            from: sender,  // Replace with your email
            to: recipient,
            subject: 'Your Subject Here',    // Customize the subject as needed
            html: htmlTemplate, 
            attachment,
            ...(isLast && { cc: cc, bcc: bcc }) // Add CC and BCC only to the last recipient
        };
    };

    try {
        // Send email to each recipient, adding CC/BCC to the last one
        for (let i = 0; i < recipients.length; i++) {
            const isLast = i === recipients.length - 1;
            const mailOptions = createMailOptions(recipients[i], isLast);
            await transporter.sendMail(mailOptions);
        }

        res.json({ message: 'Emails sent successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error occurred', error: error.message });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
