process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';
process.traceDeprecation = true;

const path = require('path');

// Grab our webpack config
let config = require(path.resolve('src/config/webpack.dev'));
let main = require(path.resolve('src/main'));

main(config);
