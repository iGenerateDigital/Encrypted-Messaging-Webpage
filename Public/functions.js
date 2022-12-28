function encryptMessage() {
    // Get the message from the input field
    var message = document.getElementById('message').value;
    // Convert the message to a base64-encoded string
    var encryptedMessage = btoa(message);
    // Display the encrypted message on the page
    document.getElementById('encryptedMessage').innerHTML = encryptedMessage;
  }
  
  // Decrypts the message and displays it on the page
  function decryptMessage() {
    // Get the encrypted message from the input field
    var encryptedMessage = document.getElementById('encryptedMessage').innerHTML;
    // Convert the base64-encoded string back to the original message
    var message = atob(encryptedMessage);
    // Display the message on the page
    document.getElementById('message').value = message;
  }

  // Send a POST request to the backend API to store the message
fetch('/api/messages', {
    method: 'POST',
    body: JSON.stringify({ message: encryptedMessage }),
    headers: {
      'Content-Type': 'application/json'
    }
  });

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
  
  fetch('/api/messages', {
    method: 'POST',
    body: JSON.stringify({ message: encryptedMessage }),
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(response => {
    if (response.ok) {
      // Send an email to the administrator
      sendEmail(encryptedMessage);
    }
  });

  // Sends a GET request to retrieve the list of menu items from the database
function getMenu() {
  fetch('/api/menu').then(response => {
    if (response.ok) {
      response.json().then(menu => {
        // Display the list of menu items on the page
        document.getElementById('menu').innerHTML = menu.items;
      });
    } else {
      alert('Error retrieving menu');
    }
  });
}
  