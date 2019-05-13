// This is simple sample how to serve static website and save form data to file with NodeJS
// Author: programming mentor
// Usage:
// 1. Install dependencies: npm i
// 2. Run: server node server.js

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

app.use(bodyParser.json());
app.use(express.static(path.resolve(__dirname, './')));

app.post('/order', (req, res) => {
  const fs = require('fs');
  fs.appendFile('./orders.txt', JSON.stringify(req.body) + '\n', function(err) {
    if (err) {
      res.status(500).send('Server error');
      return console.log(err);
    }
    console.log('Data saved: ' + JSON.stringify(req.body));
    res.send('Data saved');
  });
});

console.log(
  'Server is running on',
  process.env.PORT || 3000,
  process.env.IP || '0.0.0.0'
);

app.listen(process.env.PORT || 3000, process.env.IP || '0.0.0.0');
