'use strict';

var _ = require('lodash');
var vsprintf = require("sprintf-js").vsprintf;
var moment = require('moment');
var outdated = require('./outdated.js');
var releaseTime = require('./release-time.js');

var printTotal = function(years) {
  process.stdout.write(vsprintf('System is %.1f libyears behind\n', [years]));
};

var years = function(currentMoment, latestMoment) {
  var delta = moment(latestMoment).diff(moment(currentMoment), 'years', true);
  return Math.max(delta, 0.0);
};

var assertPackagesAreInstalled = function(packages) {
  _.forEach(packages, function(value, key) {
    if (_.isUndefined(value['current'])) {
      process.stderr.write(
        'Unable to determine current version of package: ' + key + '\n' +
        'Please check that the package is installed\n'
      );
      process.exit(2);
    }
  });
};

var stdout = outdated();

// If npm outdated produces no output, great, the total is zero libyears.
if (stdout === '') {
  printTotal(0);
  process.exit(0);
}

var packages = JSON.parse(stdout);
assertPackagesAreInstalled(packages);

var sum = 0.0;
_.forEach(packages, function(value, key) {
  var currentVersion = value['current'];
  var latestVersion = value['latest'];

  if (_.isUndefined(currentVersion)) {
    process.stderr.write(
      'Unable to determine current version of package: ' + key + '\n' +
      'Please check that the package is installed\n'
    );
    process.exit(2);
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
  process.stdout.write(row + '\n');
});

printTotal(sum);
