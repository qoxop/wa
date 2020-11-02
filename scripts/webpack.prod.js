const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const common = require('./webpack.config.js');

module.exports = ({aliasObj}) => merge(common({aliasObj}), {
    mode: 'production',
    devtool: 'source-map',
    plugins: [
        /* 代码压缩，并开启sourceMap */
        new UglifyJSPlugin({sourceMap: true})
    ]
});