const pxtorem = require('postcss-pxtorem');
const {rootFontSize} = require('./src/config.json')

module.exports = {
    plugins: [
        pxtorem({
            rootValue: rootFontSize,
            propList: ['*'],
            minPixelValue: 0,
            mediaQuery: false
        }),
        require('autoprefixer')
    ]
}