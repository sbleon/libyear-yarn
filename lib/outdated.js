'use strict';

var _ = require('lodash');
var execSync = require('child_process').execSync;

// Runs `npm outdated` and either returns a JSON string or exits the process.
function outdated() {
  var cmd = 'yarn outdated --json';
  var stdout;
  try {
    stdout = execSync(cmd, { timeout: 30000 });
  } catch(e) {
    process.stderr.write('Failed to run: ' + cmd + '\n');
    process.stderr.write(e.message + '\n');
    process.exit(1);
  }
  // `stdout` can be a `Buffer`, but we just want a string.
  return stdout.toString();
}

module.exports = outdated;
