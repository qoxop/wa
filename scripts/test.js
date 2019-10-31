const through = require('through2')
const babel = require('@babel/core')

const babelTransform = (code) => {
    return babel.transformSync(code, {
        sourceMaps: true,
        configFile: path.resolve(__dirname, './config/bable.config.js'), 
    })
}

compileTs(through(function(vinyl, enc, callback) {

    this.push(vinyl);
    callback()
}))

const fs = require('fs')
const path = require('path')

require("@babel/core").transformFile('../src/components/Button/index.tsx', {
    sourceMaps: true,
    configFile: path.resolve(__dirname, './config/bable.config.js'),
}, (err, res) => {
    if (err) throw  err;
    fs.writeFileSync('./temp/code.js', res.code)
    fs.writeFileSync('./temp/code.js.map', JSON.stringify(res.map))
})
