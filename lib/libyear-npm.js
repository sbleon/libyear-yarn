'use strict';

var outdated = require('./outdated.js');
var releaseTime = require('./release-time.js');
var calculator = require('./calculator.js');

calculator(outdated(), releaseTime);
