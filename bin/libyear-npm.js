#!/usr/bin/env node

'use strict';

var exec = require('child_process').exec;
var cmd = 'npm outdated --json';
var _ = require('lodash');
var vsprintf = require("sprintf-js").vsprintf;

exec(cmd, function(error, stdout, stderr) {
  // Just in case they don't actually have npm on their path, which would
  // be pretty weird, but ¯\_(ツ)_/¯
  if (!_.isNull(error) && _.includes(error.message, 'command not found')) {
    process.stderr.write(error.message);
    process.exit(1);
  }

  var printTotal = function(years) {
    process.stdout.write('System is ' + years + ' libyears behind\n');
  };

  // If npm outdated produces no output, great, the total is zero libyears.
  if (stdout === '') {
    printTotal(0);
    process.exit(0);
  }

  var parsed = JSON.parse(stdout);
  var report = [];
  _.forEach(parsed, function(value, key) {
    var row = vsprintf("%20s %10s %10s", [key, value['current'], value['latest']]);
    process.stdout.write(row + '\n');
  });
});
