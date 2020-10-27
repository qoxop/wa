const path = require('path');

module.exports = {
    webpackCfg: {
        run: path.resolve(__dirname, '../scripts/webpack.prod.js'),
        build: path.relative(__dirname, '../../scripts/webpack.prod.js')
    },
    asyncImport: true,
    homePage: './app.mdx',
    docDirs: [
        {name: '通用文档', path: 'common'},
        {name: '样式文档', path: 'UI'},
    ]
}