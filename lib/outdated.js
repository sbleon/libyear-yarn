'use strict';

var _ = require('lodash');
var execSync = require('child_process').execSync;

// Runs `npm outdated` and either returns a JSON string or exits the process.
function outdated() {
  var cmd = 'npm outdated --json';
  var stdout;
  try {
    // If there are no outdated pacakges, npm will exit with status 0 and
    // `execSync` will not throw.
    stdout = execSync(cmd, { timeout: 30000 });
  } catch(e) {
    // When npm exits with status code 1, it is normal and indicates that some
    // packages are out of date.
    if (e.status === 1 && _.isNull(e.error)) {
      stdout = e.stdout;
    } else {
      process.stderr.write('Failed to run: ' + cmd + '\n');
      process.stderr.write(e.message + '\n');
      process.exit(1);
    }
  }
  // `stdout` can be a `Buffer`, but we just want a string.
  return stdout.toString();
}

module.exports = outdated;
