'use strict';

require('dotenv').config({ silent: true }); // Load ignore

const server = require('./lib/app');

//Kick off
server.listen(process.env.PORT || 3000);
console.log("App run on : http://localhost:3000");