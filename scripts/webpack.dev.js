const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const getCommonCfg = require('./webpack.config');
const { merge } = require('webpack-merge')

process.env.NODE_ENV = 'development';

module.exports = (meta) => {
    const commonCfg = getCommonCfg(meta);
    const config = merge(commonCfg, {
        mode: 'development',
        devtool: 'eval-source-map', // 设置开发环境 sourceMap 品质
        plugins: [
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
                'process.env.TEST': 'true'
            })
        ]
    });
    return config;
}