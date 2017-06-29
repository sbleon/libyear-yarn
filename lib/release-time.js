'use strict';

var _ = require('lodash');
var execSync = require('child_process').execSync;
var moment = require('moment');

function releaseTime(packageName, version) {
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
  return moment(_.get(parsed, ['time', version]));
}

module.exports = releaseTime;
