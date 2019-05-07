'use strict';

const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const formidable = require('formidable');
const randomID = require("random-id");

const { APITokens } = require('./config.json');

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
app.use(bodyParser.text());
app.use(express.static('./uploads/', {
    extensions: [
        "png", "jpg", "gif", "mp4", "mp3","jpeg", "tiff", "bmp", "ico", "psd", "eps", "raw", "cr2", "nef", "sr2", "orf", "svg", "wav", "webm", "aac", "flac", "ogg", "wma", "m4a", "gifv", "html"
    ]
}));

let existingPictures = fs.readdirSync("./uploads/") || [];
existingPictures = existingPictures.map(file => file.replace(/(\.)+([a-zA-Z0-9]+)+/g, ""));

/**
 * Send index
 */
app.get('/', (req, res, next) => {
    
    const host = req.get('host');
    
    if (host.toLowerCase() === "thighhigh.club") {
        res.send(path.resolve(__dirname, 'public', 'thc.html'));
        return;
    }
    
    console.log('there was a request!!!!');

    const userIP = req.cf_ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    fs.readFile(path.resolve(__dirname, 'public', 'party.html'), 'utf8', (err, data) => {

        // simple error handle
        if (err) return next(err);

        // replace the USER_IP string with the user's IP (i know, revolutionary right?)
        const newIndex = data.toString().replace(/%_USER_IP_%/ig, userIP.toString());

        res.send(newIndex); // sends the user the website

    });
});

/**
 * Handle 404 / 500
 */
app.get("*", (err, req, res, next) => {
    res.status(404).send("rip");
});

/**
 * This has nothing to do with the website and is purely to allow me and a friend to upload images to the host or custom pages.
 */
app.post('/share', (req, res, next) => {

    /**
     * Prevents any repeat codes occurring. (Not the ideal way but one of the best ways)
     */
    let code = randomID(5);
    while (existingPictures.includes(code)) code = randomID(5);

    const form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {

        if (!APITokens.includes(fields.key)) return res.send(403);

        const oldpath = files.fdata.path;
        const newpath = `./uploads/${code+files.fdata.name.toString().match(/(\.)+([a-zA-Z0-9]+)+/g, "").toString()}`;

        fs.rename(oldpath, newpath, err => {
            if (err) {
                console.error(err);
                return res.send(500);
            }

            res.send(`https://${req.get('host')}/` + code + ((files.fdata.name.split('.')[1] === 'gif')?'.gif':''));
        });

    });
});



const httpServer = http.createServer(app);
const httpsServer = https.createServer({key, cert}, app);

// listens to both
httpServer.listen(80);
httpsServer.listen(443);

console.log('yes');