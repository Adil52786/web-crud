// @flow

const bodyParser = require('body-parser');
const express = require('express');
const healthCheck = require('express-healthcheck');
const morgan = require('morgan');
const path = require('path');

const {contactService} = require('./contact-service');

const app = express();

// Serve files.
const clientPath = __dirname + '/../../client';
//const clientPath = path.resolve('../client');
//const clientPath = path.normalize(__dirname + '../client');
console.log('index.js x: __dirname =', __dirname);
console.log('index.js x: clientPath =', clientPath);
app.use(clientPath, express.static('public'));

// Parse JSON request bodies to JavaScript objects.
app.use(bodyParser.json());

// Parse text request bodies to JavaScript strings.
app.use(bodyParser.text());

contactService(app);

// Logging
// The provided options are combined, common, dev, short, and tiny.
// For more details, browse https://github.com/expressjs/morgan.
app.use(morgan('dev'));
app.use(/^\/$/, healthCheck());

const PORT = 3000;
app.listen(PORT, () => console.info('listening on', PORT));
