/**
 * Run with: node test-upperscore.js
 */

var __ = require('./upperscore.js');
var ast = require('./ast.js');

var tests = {

  // String tests
  reverseString: function(){
    ast.func = __.reverseString;
    ast.equal(ast.func('ih'), 'hi');
  },
  snakeCase: function(){
    ast.func = __.snakeCase;
    ast.equal((__.snakeCase('Eric')), 'ErIc');
    ast.equal(ast.func('hi'), 'Hi');
  },
  // Array tests
  first: function(){
    ast.func = __.first;
    ast.equal(ast.func([1, 2, 3], 1), [1]);
    ast.equal(ast.func([1, 2, 3], 4), [1, 2, 3]);
  },
  map: function(){
    ast.func = __.map;
    var mapFunc = function(el){ // Square function for testing
      return el * el;
    };
    ast.equal(ast.func([1, 2, 3], mapFunc), [1, 4, 9]);
  }

}

ast.run(tests);
