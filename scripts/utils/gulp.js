const path = require('path')
const through = require('through2')
const babel = require('@babel/core')
const Vinyl = require('vinyl')
const less = require('less')

const babelTransform = (code, sourceMap, type) => {
    return babel.transformAsync(code === 'string' ? code : code.toString(), {
        sourceMaps: sourceMap ? 'inline' : false,
        configFile: path.resolve(__dirname, `../config/babel.${type}.config.js`),
    })
}

const copyVinyl = (vinyl, path, contents) => (new Vinyl({cwd: vinyl.cwd, base: vinyl.base, path, contents}))

module.exports.compileLessPlugin = function(sourceMap) {
    const options = {
        env: process.env.NODE_ENV,
        sourceMap: sourceMap ? {sourceMapFileInline: false} : undefined,
    }
    return through.obj(function (vinyl = new Vinyl(), enc, callback) {
        less.render(vinyl.contents.toString(), {filename: vinyl.path, ...options}, (err, output) => {
            if (err) {
                console.log(err)
                throw err;
            };
            const css = output.css.trim();
            if (css) {
                this.push(copyVinyl(
                    vinyl,
                    vinyl.path.replace(/\.less$/, '.css'),
                    Buffer.from(css)
                ))
                if (sourceMap && output.map) {
                    this.push(copyVinyl(
                        vinyl,
                        vinyl.path.replace(/\.less$/, '.css.map'),
                        Buffer.from(output.map)
                    ))
                }
            }
            this.push(vinyl)
            callback()
        })
    })
}

module.exports.compileTsPlugin = function(sourceMap, type) {
    return through.obj(function (vinyl = new Vinyl(), enc, callback) {
        babelTransform(vinyl.contents, sourceMap, type).then(({code}) => {
            vinyl.contents = Buffer.from(code);
            vinyl.extname = '.js';
            this.push(vinyl);
            callback()
        })
    })
}