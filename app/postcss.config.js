/**
* Postcss-loader configurations
* This must either be in the root of the repo or in the root dir of the scss files being loaded
*/
const autoprefixer = require('autoprefixer');

module.exports = {
  plugins: [ autoprefixer ]
};
