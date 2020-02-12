'use strict';

var execSync = require('child_process').execSync;

function releaseTime(packageName) {
  var cmd = 'yarn info ' + packageName + ' time --json';
  var stdout = null;
  try {
    stdout = execSync(cmd);
  } catch(e) {
    process.stderr.write('Failed to run: ' + cmd + '\n');
    process.stderr.write(error.message);
    process.exit(1);
  }
  if (stdout === '') {
    process.stderr.write('yarn info produced no output, no idea why');
    process.exit(1);
  }
  var parsed = JSON.parse(stdout);
  return parsed.data;
}

module.exports = releaseTime;
