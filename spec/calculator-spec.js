describe("calculator", function() {
  var calculator = require('../lib/calculator.js');

  it("is a function", function () {
    expect(typeof(calculator)).toEqual("function")
  });
});
