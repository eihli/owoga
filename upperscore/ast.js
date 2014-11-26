module.exports = function(){
  var ast = {};
  ast.message = ''
  ast.test = {};
  ast.func = {};

  // Reset ast variables before each test
  ast.reset = function(newTest){
    ast.testFailed = false;
    ast.test = newTest;
  }

  ast.run = function(tests){
    var testCounter = 0, testFailCounter = 0;
    ast.assertionCounter = 0, ast.assertionFailCounter = 0;

    for (test in tests){
      ast.testName = test;
      ast.test = tests[test];
      ast.test(); // Run the test
      testCounter++;

      if (ast.testFailed){
        testFailCounter++;
        ast.testFailed = false;
      }
    }

    ast.message += "\nRan " + testCounter + " tests and " + ast.assertionCounter + " assertions.";
    ast.message += "\n" + testFailCounter + " test failures and " + ast.assertionFailCounter
      + " assertion failures";
    console.log(ast.message);
  }

  ast.equal = function(actual, expected){
    // Hack for array equality
    if (actual instanceof Array && expected instanceof Array){
      if (actual.length == expected.length 
      && (function(){
        for (var i = 0; i < actual.length; i++){
          if (actual[i] != expected[i]){
            return false;
          }
        }
        return true;
      })())
        actual = expected = 1 // Dummy values so equal arrays pass the next test 
    }
    if (actual != expected){
      ast.message += ast.testName + " " + actual + " not equal to " + expected + "\n";
      ast.assertionFailCounter++;
      ast.testFailed = true;
    }
      ast.assertionCounter++;
  }

  return ast;
}();
