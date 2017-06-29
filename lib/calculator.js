'use strict';

var _ = require('lodash');
var vsprintf = require("sprintf-js").vsprintf;
var moment = require('moment');

function printTotal(years, stdout) {
  stdout.write(vsprintf('System is %.1f libyears behind\n', [years]));
}

function years(currentMoment, latestMoment) {
  var delta = moment(latestMoment).diff(moment(currentMoment), 'years', true);
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

// - outdated - JSON string, the stdout from npm outdated.
// - releaseTime - function(packageName, version) returns a `moment`.
//   Dependency injected to aid testing.
// - stdout - Something we can write output to. Dependency injected to aid
//   testing.
function calculator(outdated, releaseTime, stdout) {
  // If npm outdated produces no output, great, the total is zero libyears.
  if (outdated === '') {
    printTotal(0, stdout);
    return;
  }

  var packages = JSON.parse(outdated);
  assertPackagesAreInstalled(packages);

  var sum = 0.0;
  _.forEach(packages, function(value, key) {
    var currentVersion = value['current'];
    var latestVersion = value['latest'];

    if (_.isUndefined(currentVersion)) {
      var msg = 'Unable to determine current version of package: ' + key +
        '\nPlease check that the package is installed\n';
      throw({ message: msg, status: 2 });
    }

    // Known issue: Each call to `releaseTime` runs `npm view`, which means two
    // network requests that could be combined into one.
    var currentMoment = releaseTime(key, currentVersion);
    var latestMoment = releaseTime(key, latestVersion);

    var yrs = years(currentMoment, latestMoment);
    sum += yrs;
    var row = vsprintf(
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
