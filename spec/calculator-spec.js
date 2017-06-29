describe("calculator", function() {
  var calculator = require('../lib/calculator.js');

  it("is a function", function() {
    expect(typeof(calculator)).toEqual("function");
  });

  describe("nothing is outdated", function() {
    it("prints a total of 0.0", function() {
      var outdated = '';
      var releaseTime = function() {
        throw "test failed: unexpected call"
      };
      var stdout = { write: function() {} };
      spyOn(stdout, 'write');
      calculator(outdated, releaseTime, stdout);
      expect(stdout.write).toHaveBeenCalledWith(
        'System is 0.0 libyears behind\n'
      );
    });
  });
});
