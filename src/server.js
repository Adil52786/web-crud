// @flow

const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const healthCheck = require('express-healthcheck');
const morgan = require('morgan');
//const path = require('path');

const {contactService} = require('./contact-service');

const app = express();

// Serve files.
app.use(express.static('public'));

// Parse JSON request bodies to JavaScript objects.
app.use(bodyParser.json());

// Parse text request bodies to JavaScript strings.
app.use(bodyParser.text());

// Enable cross-origin resource sharing.
app.use(cors());

contactService(app);

// Logging
// The provided options are combined, common, dev, short, and tiny.
// For more details, browse https://github.com/expressjs/morgan.
app.use(morgan('dev'));
app.use(/^\/$/, healthCheck());

const PORT = 3000;
app.listen(PORT, () => console.info('listening on', PORT));
