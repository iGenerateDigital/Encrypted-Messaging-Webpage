const express = require('express');
const mongodb = require('mongodb');
const nodemailer = require('nodemailer');
const sgTransport = require('@sendgrid/mail');

const app = express();
const port = process.env.PORT || 5000;

// Set up the SendGrid API key
sgTransport.setApiKey(process.env.SENDGRID_API_KEY);

// Connect to the MongoDB database
mongodb.MongoClient.connect(process.env.MONGODB_URI, { useNewUrlParser: true }, (err, client) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  const db = client.db();

  // Send an email to the administrator when a message is submitted
  function sendEmail(encryptedMessage) {
    const msg = {
      to: 'admin@igeneratedigital',
      from: 'noreply@yourdomain.com',
      subject: 'New Encrypted Message',
      text: `A new encrypted message has been submitted: ${encryptedMessage}`,
      html: `<p>A new encrypted message has been submitted: ${encryptedMessage}</p>`,
    };
    sgTransport.send(msg);
  }

  // Store the message in the database and send an email to the administrator
  app.post('/api/messages', (req, res) => {
    db.collection('messages').insertOne({ message: req.body.message }, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send({ error: 'Error storing message in database' });
      } else {
        sendEmail(req.body.message);
        res.send({ message: 'Message stored successfully' });
      }
    });
  });

  // Store the list of menu items in the database
  app.post('/api/menu', (req, res) => {
    db.collection('menu').insertOne({ items: req.body.items }, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send({ error: 'Error storing menu in database' });
      } else {
        res.send({ message: 'Menu stored successfully' });
      }
    });
  });

  // Retrieve the message from the database
  app.get('/api/messages/:id', (req, res) => {
    db.collection('messages').findOne({ _id: mongodb.ObjectID(req.params.id) }, (err, message) => {
      if (err) {
        console.error(err);
        res.status(500).send({ error: 'Error retrieving message from database' });
      } else {
        res.send(message);
      }
    });
  });

  // Retrieve the list of menu items from the database
app.get('/api/menu', (req, res) => {
  db.collection('menu').findOne({}, (err, menu) => {
    if (err) {
      console.error(err);
      res.status(500).send({ error: 'Error retrieving menu from database' });
    } else {
      res.send(menu);
    }
  });
});
});
