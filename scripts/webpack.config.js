const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isProd = process.env.NODE_ENV === 'production';

module.exports = ({aliasObj}) => ({
    entry: {
        app: path.resolve(__dirname, '../application/index.tsx'),
    },
    output: {
        filename: '[name].[hash].js',
        chunkFilename: '[name].[chunkhash].js',
        path: path.resolve(__dirname, '../dist')
    },
    module: {
        rules: [{
            test: /\.mdx?$/,
            use: [
                { 
                    loader: 'babel-loader',
                    options: { cacheDirectory: true }
                },
                { loader: '@mdx-js/loader' }
            ]
        }, {
            test: /\.(t|j)sx?$/,
            use: [ 
                {
                    loader: 'babel-loader',
                    options: { cacheDirectory: true }
                }
            ],
        }, {
            test: /\.less$/,
            use: [
                {
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                        modules: false,
                        publicPath: '/styles'
                    }
                },
                {
                    loader: 'css-loader',
                    options: {
                        modules: false,
                        sourceMap: !isProd,
                        importLoaders: 2,
                    }
                },
                {loader: "postcss-loader", options: {sourceMap: !isProd}},
                {loader: "less-loader", options: {
                        sourceMap: !isProd,
                        lessOptions: {
                            rewriteUrls: 'local', // 使得 less 支持相对路径引入文件
                        }
                    }
                }
            ]
        }, {
            test: /\.scss$/,
            use: [
                {
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                        publicPath: '/styles'
                    }
                },
                {
                    loader: 'css-loader',
                    options: {
                        modules: false,
                        sourceMap: !isProd,
                        importLoaders: 2,
                    }
                },
                { loader: "postcss-loader", options: {sourceMap: !isProd} },
                { loader: "sass-loader", options: { sourceMap: !isProd} }
            ]
        }, {
            test: /\.(png|jpg|gif)$/, // 处理图片
            loader: 'url-loader',
            options: {
              // 小于8K的图片自动转成base64，并且不会存在实体图片
              limit: 8192,
              // 图片打包后存放的目录
              outputPath: 'images/'
            }
        }, {
            test: /\.(eot|ttf|woff|woff2|svg)$/, // 处理字体
            use: {
                loader: 'file-loader',
                options: {
                    outputPath: 'fonts/'
                }
            }
        },]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', 'jsx'],
        alias: Object.assign({
            "@assets": path.resolve(__dirname, '../application/assets'),
            
        }, aliasObj)
    },

    plugins: [
        /** 清除输出目录 */
        new CleanWebpackPlugin(),
        /** 定义运行时可以获得的环境变量 */
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
            'process.env.TEST': 'false'
        }),
        new MiniCssExtractPlugin(),
        /** 生成一份引用 bundle 的html文件 */
        new HtmlWebpackPlugin({
            template:  'index.html',
            filename: 'index.html',
        }),
    ]
});