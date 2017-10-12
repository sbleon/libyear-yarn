'use strict';

var _ = require('lodash');
var execSync = require('child_process').execSync;

// Runs `npm outdated` and either returns a JSON string or exits the process.
function outdated() {
  const cmd = 'yarn outdated --json';
  let stdout;
  try {
    stdout = execSync(cmd, { timeout: 30000 });
  } catch(e) {
    // When yarn exits with status code 1, it is normal and indicates that some
    // packages are out of date.
    if (e.status === 1 && _.isNull(e.error)) {
      stdout = e.stdout;
    } else {
      process.stderr.write('Failed to run: ' + cmd + '\n');
      process.stderr.write(e.message + '\n');
      process.exit(1);
    }
  }

  // yarn's JSONReporter outputs a stream of JSON objects. The entire stream may not be
  // valid JSON, because there are multiple top-level objects. We just look for the first
  // object where type is 'table'.
  const allJSONs = stdout.toString().trim();
  if (allJSONs.length === 0 ) {
    return '';
  }
  const dataTable = allJSONs.split('\n').find(json => JSON.parse(json).type === 'table');

  if (!dataTable) {
    throw "No JSON packet with type === 'table' found in output of `yarn outdated --json`";
  }

  return dataTable;
}

module.exports = outdated;
