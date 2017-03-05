#!/usr/bin/env node

'use strict';

var exec = require('child_process').exec;
var cmd = 'npm outdated --json';
var _ = require('lodash');
var vsprintf = require("sprintf-js").vsprintf;
var execSync = require('child_process').execSync;

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

  var releaseTime = function(packageName, version) {
    var cmd = 'npm view --json ' + packageName;
    var stdout = null;
    try {
      stdout = execSync(cmd);
    } catch(e) {
      process.stderr.write('Failed to run: ' + cmd + '\n');
      process.stderr.write(error.message);
      process.exit(1);
    }
    if (stdout === '') {
      process.stderr.write('npm view produced no output, no idea why');
      process.exit(1);
    }
    var parsed = JSON.parse(stdout);
    return _.get(parsed, ['time', version]);
  };

  var report = [];
  _.forEach(parsed, function(value, key) {
    var currentVersion = value['current'];
    var currentTime = releaseTime(key, currentVersion);
    var latestVersion = value['latest'];
    var latestTime = releaseTime(key, latestVersion);
    var row = vsprintf(
      "%20s %10s %30s %10s %30s",
      [key, currentVersion, currentTime, latestVersion, latestTime]
    );
    process.stdout.write(row + '\n');
  });
});
