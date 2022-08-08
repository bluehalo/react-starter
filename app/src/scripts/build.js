process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';
process.traceDeprecation = true;

const path = require('path');
const pug = require('pug');
const fs = require('fs');
const { promisify } = require('util');
const { parseAssetPaths } = require(path.resolve('src/lib/webpack'));

// Grab our webpack config
let config = require(path.resolve('src/config/webpack.prod'));

require(path.resolve('src/lib/webpack')).compile(config).then(async () => {
    let statsPath = path.resolve('bin/stats.json');
    let binPath = path.resolve('bin');
    let css = '';
    let stats = require(statsPath);
    // Parse out code paths and styles, the format of this changes from
    // development to production. The main chunk in dev is a string, in prod,
    // it is an array with the path to a css asset that needs to be inlined
    let { js: jsCommon } = parseAssetPaths(stats.assetsByChunkName.common || '');
    let { css: cssMain, js: jsMain } = parseAssetPaths(stats.assetsByChunkName.main);
    
    // Grab our css file as plaintext
    if (cssMain) {
        css = fs.readFileSync(path.join(binPath, stats.publicPath, cssMain), {
            encoding: 'utf-8',
        });
    }
    
    // Send back our core template
    const html = pug.renderFile(path.resolve('src/server/core/views/core.pug'), {
        commonSrc: path.join(stats.publicPath, jsCommon),
        mainSrc: path.join(stats.publicPath, jsMain),
        css: css,
    });

    await promisify(fs.writeFile)(path.join(binPath, 'index.html'), html);
});

