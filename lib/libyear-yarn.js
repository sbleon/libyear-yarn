'use strict';

var _ = require('lodash');
var outdated = require('./outdated.js');
var releaseTime = require('./release-time.js');
var calculator = require('./calculator.js');

try {
  calculator(outdated(), releaseTime, process.stdout);
}
catch(e) {
  console.error(e.message);
  var status = _.isInteger(e.status) ? e.status : 1;
  process.exit(status);
}
