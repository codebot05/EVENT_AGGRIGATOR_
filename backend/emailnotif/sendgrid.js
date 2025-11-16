const sgMail = require('@sendgrid/mail');
const path = require('path');
const fs = require('fs')
require('dotenv').config();

sgMail.setApiKey(process.env.SEND_GRID);


const sendEventNotification = async (eventDetails, recipients) => {
    const imagePath = path.join(__dirname, '..', eventDetails.eventImage);
    const imageFile = fs.readFileSync(imagePath);
    const base64Image = imageFile.toString('base64');
    const mimeType = path.extname(eventDetails.eventImage) === '.jpg' ? 'image/jpeg' : 'image/png';


    const msg = {
        to: recipients, 
        from: 'ajayarukonda524@gmail.com',
        subject: `New Event: ${eventDetails.eventName}`,
        html: `
            <h1>${eventDetails.eventName}</h1>
            <p><strong>Date:</strong> ${eventDetails.date}</p>
            <p><strong>Time:</strong> ${eventDetails.time}</p>
            <p><strong>Location:</strong> ${eventDetails.location}</p>
            <p><strong>Description:</strong></p>
            <p>${eventDetails.description}</p>
            <p><a href="http://192.168.0.117:3001/events" target="_blank">Click here for more details</a></p>
            <img src="data:image/png;base64,${base64Image}" alt="Event Image" />
        `,
    };

    try {
        await sgMail.send(msg);
        console.log('Emails sent successfully!');
    } catch (error) {
        if (error.response) {
            // If error.response is available, log detailed error response from SendGrid
            console.error('SendGrid API Error:', error.response.body.errors);
        } else {
            // Handle other errors (e.g., network issues or wrong API key)
            console.error('Error sending email:', error.message || error);
        }
    }
};

module.exports = sendEventNotification;
