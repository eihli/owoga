var __ = require('./upperscore.js');
var ast = require('./ast.js');

var tests = {
  // String tests
  reverseString: function(){
    ast.func = __.reverseString;
    ast.equal('ih', 'hi');
  },
  snakeCase: function(){
    ast.func = __.snakeCase;
    ast.equal('Eric', 'ErIc');
    ast.equal('hi', 'Hi');
  }
}

ast.run(tests);
