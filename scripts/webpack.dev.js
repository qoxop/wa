const webpack = require('webpack')
const merge = require('webpack-merge');
const common = require('./webpack.config.js');
const path = require('path')

module.exports = merge(common, {
    mode: 'development',
    devtool: 'eval-source-map', // 设置开发环境 sourceMap 品质
    devServer: {
        /** 开发服务器配置，详细使用参考文档 */
        contentBase: path.join(__dirname, "../dist"),
        compress: true,
        port: 9999,
        hot: true,
        open: true,
        inline: true,
    },
    plugins: [
        /** 模块热重载载，需配合相关loader使用 */
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ]
});