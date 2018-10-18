'use strict';

const fs = require('fs');
const path = require('path');

// HTTPS certificate stuff
const key = fs.readFileSync('./ssl/key.pem');
const cert = fs.readFileSync('./ssl/cert.pem');

const express = require('express');
const http = require('http');
const https = require('https');

const app = express();

const cloudflare = require('cloudflare-express');
const forceSSL = require('express-force-ssl');

// stuff
app.set('trust proxy', 1);
app.use(express.static(path.join(__dirname, 'public'), { redirect: false }));
app.use(cloudflare.restore());
app.use(forceSSL);


// gather all requests and send it directly to the memes
app.get('*', (req, res) => {
	console.log('there was a request!!!!');
  const userIP = req.cf_ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  fs.readFile(path.resolve(__dirname, 'public', 'party.html'), 'utf8', (err, data) => {
    
    // simple error handle
    if (err) {
      res.status(500).send('INTERNAL SERVER ERROR');
      console.error(err);
      return;
    }
    
    // replace the USER_IP string with the user's IP (i know, revolutionary right?)
    const newIndex = data.toString().replace(/%_USER_IP_%/ig, userIP.toString());
    
    res.send(newIndex); // sends the user the website
    
  });
});


const httpServer = http.createServer(app);
const httpsServer = https.createServer({key, cert}, app);

// listens to both
httpServer.listen(80);
httpsServer.listen(443);

console.log('yes');


