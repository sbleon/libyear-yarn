'use strict';

var exec = require('child_process').exec;
var cmd = 'npm outdated --json';
var _ = require('lodash');
var vsprintf = require("sprintf-js").vsprintf;
var execSync = require('child_process').execSync;
var moment = require('moment');

exec(cmd, function(error, stdout, stderr) {
  var printTotal = function(years) {
    process.stdout.write(vsprintf('System is %.1f libyears behind\n', [years]));
  };

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
    return moment(_.get(parsed, ['time', version]));
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

  // Just in case they don't actually have npm on their path, which would
  // be pretty weird, but ¯\_(ツ)_/¯
  if (!_.isNull(error) && _.includes(error.message, 'command not found')) {
    process.stderr.write(error.message);
    process.exit(1);
  }

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
});
