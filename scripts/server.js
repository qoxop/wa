const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const generator = require('./_generator');
const getWebpConfig = require('./webpack.dev');

generator((meta) => {
    const app = express();
    const config = getWebpConfig(meta);
    const compiler = webpack(config)
    
    app.use(webpackDevMiddleware(compiler, {
        publicPath: config.output.publicPath,
    }));
  
    // 将文件 serve 到 port 3000。
    app.listen(3000, function () {
        console.log('Example app listening on port 3000!\n');
    });

})

