const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const isProd = process.env.NODE_ENV === 'production';


const baseConfig = {
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
                { loader: 'babel-loader' },
                { loader: '@mdx-js/loader' }
            ]
        }, {
            test: /\.tsx?$/,
            loader: { loader: 'babel-loader' },
            options: {},
        }, {
            test: /\.less$/,
            use: ExtractTextPlugin.extract({
                fallback: "style-loader",
                use: [
                    {
                        loader: 'css-loader',
                        // 支持 css moduel， 配置局部名字规则
                        options: {
                            importLoaders: 2,
                            modules: {
                                mode: 'local',
                                localIdentName: '[path][name]__[local]--[hash:base64:5]',
                            },
                            sourceMap: !isProd,
                        }
                    },
                    {loader: "postcss-loader", options: {sourceMap: !isProd}},
                    {loader: "less-loader", options: { sourceMap: !isProd }}
                ]
            })
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
        alias: {
            assets: path.resolve(__dirname, '../assets/'),
        }
    },
    optimization: {
        // 代码分割原则，只对 多个入口的共用模块，按需加载的模块(不管是不是多个入口)进行分割。
        // 'all'（所有代码块，），'async'（按需加载的代码块），'initial'（初始化代码块）
        splitChunks: {
            chunks: "all",
            minSize: 30000, // 这里限制的只是 多个入口的共用模块 的分割规则，共用的块必须到达这个大小才会被分割
            minChunks: 1, // 目测这个地方没什么用处，待考究
            maxAsyncRequests: 5, // 按需加载时的最大并行请求数量，超过了就不再分割
            maxInitialRequests: 3, // 入口点上的最大并行请求数
            automaticNameDelimiter: '~', // 名字分割线
            name: true,
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                    chunks: "all",
                    minChunks: 1, // 这个地方起作用,  在分割之前，这个代码块最小应该被引用的次数（译注：保证代码块复用性，默认配置的策略是不需要多次引用也可以被分割）
                },
                default: {
                    minChunks: 2,
                    minSize: 30000, // default 30k
                    priority: -20,
                    reuseExistingChunk: true,
                    chunks: 'all'
                }
            }
        },
        // runtimeChunk: true
    },
    plugins: [
        /** 定义运行时可以获得的环境变量 */
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
            'process.env.TEST': 'true'
        }),
        new ExtractTextPlugin("styles/styles.css"),
        /** 清除输出目录 */
        new CleanWebpackPlugin(),
        /** 生成一份引用 bundle 的html文件 */
        new HtmlWebpackPlugin({
            template:  'index.html',
            filename: 'index.html',
        }),
    ]
};
module.exports = baseConfig