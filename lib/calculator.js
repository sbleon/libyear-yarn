'use strict';

const _ = require('lodash');
const vsprintf = require("sprintf-js").vsprintf;
const moment = require('moment');

function printTotal(years, stdout) {
  stdout.write(vsprintf('System is %.1f libyears behind\n', [years]));
}

function years(currentMoment, latestMoment) {
  const delta = moment(latestMoment).diff(moment(currentMoment), 'years', true);
  return Math.max(delta, 0.0);
}

function assertPackagesAreInstalled(packages) {
  _.forEach(packages, function(value, key) {
    if (_.isUndefined(value['current'])) {
      process.stderr.write(
        'Unable to determine current version of package: ' + key + '\n' +
        'Please check that the package is installed\n'
      );
      process.exit(2);
    }
  });
}

// - outdated - JSON string, the stdout from yarn outdated.
// - releaseTime - function(packageName, version) returns a `moment`.
//   Dependency injected to aid testing.
// - stdout - Something we can write output to. Dependency injected to aid
//   testing.
function calculator(outdated, releaseTime, stdout) {
  // If `yarn outdated` produced no output, great, the total is zero libyears.
  if (outdated === '') {
    printTotal(0, stdout);
    return;
  }

  let packages = {};
  JSON.parse(outdated).data.body.forEach(row => {
    packages[row[0]] = { current: row[1], latest: row[3] }
  });
  assertPackagesAreInstalled(packages);

  let sum = 0.0;
  _.forEach(packages, function(value, key) {
    const currentVersion = value['current'];
    const latestVersion = value['latest'];

    if (_.isUndefined(currentVersion)) {
      const msg = 'Unable to determine current version of package: ' + key +
        '\nPlease check that the package is installed\n';
      throw({ message: msg, status: 2 });
    }

    if(latestVersion === 'exotic') {
        return;
    }

    const releaseTimeMap = releaseTime(key);
    const currentMoment = moment(releaseTimeMap[currentVersion]);
    const latestMoment = moment(releaseTimeMap[latestVersion]);

    const yrs = years(currentMoment, latestMoment);
    sum += yrs;
    const row = vsprintf(
      "%30s %10s %15s %10s %15s %7.2f",
      [
        key,
        currentVersion,
        currentMoment.format('YYYY-MM-DD'),
        latestVersion,
        latestMoment.format('YYYY-MM-DD'),
        yrs
      ]
    );

    // Printing each line as soon as we can is nice, actually, since each row
    // takes so long. It lets people know something is happening.
    stdout.write(row + '\n');
  });

  printTotal(sum, stdout);
}

module.exports = calculator;
