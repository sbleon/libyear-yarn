describe("calculator", function() {
  var calculator = require('../lib/calculator.js');
  var moment = require('moment');

  it("is a function", () => {
    expect(typeof(calculator)).toEqual("function");
  });

  describe("nothing is outdated", () => {
    it("prints a total of 0.0", () => {
      var outdated = '';
      var releaseTime = () => { throw "test failed: unexpected call" };
      var stdout = { write: () => {} };
      spyOn(stdout, 'write');
      calculator(outdated, releaseTime, stdout);
      expect(stdout.write).toHaveBeenCalledWith(
        'System is 0.0 libyears behind\n'
      );
    });
  });

  describe("a package is outdated", () => {
    it("prints the expected output", () => {
      var outdated = JSON.stringify(
        {
          "banana": {
            "current": "1.0.0",
            "wanted": "1.0.1",
            "latest": "2.0.0",
            "location": "node_modules/banana"
          }
        }
      );
      var releaseTime = (packageName, version) => {
        return {
          "1.0.0": moment("2016-02-28"),
          "1.0.1": moment("2016-02-29"),
          "2.0.0": moment("2017-02-28")
        }[version];
      };
      var stdout = { write: () => {} };
      spyOn(stdout, 'write');
      calculator(outdated, releaseTime, stdout);
      expect(stdout.write).toHaveBeenCalledWith(
        '                        banana      1.0.0      2016-02-28' +
        '      2.0.0      2017-02-28    1.00\n'
      );
      expect(stdout.write).toHaveBeenCalledWith('System is 1.0 libyears behind\n');
    });
  });
});
