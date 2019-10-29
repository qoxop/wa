const webpack = require('webpack')
const webpackConf = require('./webpack.prod')
process.env.NODE_ENV = 'production'

webpack(webpackConf, (err, stats) => {
    if (err) {
        throw err;
    }
    process.stdout.write(stats.toString({
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false
    }) + '\n\n')
    if (stats.hasErrors()) {
        process.exit(1)
    } else {
        console.log('build success !~ \r\n');
    }
})