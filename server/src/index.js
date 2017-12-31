// @flow

const bodyParser = require('body-parser');
const express = require('express');
const healthCheck = require('express-healthcheck');
const morgan = require('morgan');

const {contactService} = require('./contact-service');

const app = express();

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

const PORT = 3001;
app.listen(PORT, () => console.info('listening on', PORT));
