describe("calculator", function() {
  const calculator = require('../lib/calculator.js');

  it("is a function", () => {
    expect(typeof(calculator)).toEqual("function");
  });

  describe("nothing is outdated", () => {
    it("prints a total of 0.0", () => {
      const outdated = '';
      const releaseTime = () => { throw "test failed: unexpected call" };
      const stdout = { write: () => {} };
      spyOn(stdout, 'write');
      calculator(outdated, releaseTime, stdout);
      expect(stdout.write).toHaveBeenCalledWith(
        'System is 0.0 libyears behind\n'
      );
    });
  });

  describe("a package is outdated", () => {
    it("prints the expected output", () => {
      const outdated = JSON.stringify(
        {
          "type": "table",
          "data": {
            "head": [ "Package", "Current", "Wanted", "Latest", "Package Type", "URL" ],
            "body": [
              [ "banana", "1.0.0", "1.0.1", "2.0.0", "dependencies", ""]
            ]
          }
        }
      );
      const releaseTime = (packageName) => {
        return {
          "1.0.0": "2016-02-28",
          "1.0.1": "2016-02-29",
          "2.0.0": "2017-02-28"
        };
      };
      const stdout = { write: () => {} };
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
