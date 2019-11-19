const path = require('path')
const {compileTsPlugin, compileLessPlugin} = require('./utils/gulp')
const {src, dest, series, parallel} = require('gulp')
const {scanner} = require('./utils/fs')
const gulpIf = require('gulp-if')
const fs = require('fs')

const isDev = process.env.NODE_ENV === 'development';
const absPath = (sub) => path.resolve(__dirname, sub);
const getOutPath = (dir) => path.resolve(__dirname, `../${dir}/`)

const inputPaths = [absPath('../src/**/*.*')]


function mkIndexLess(srcFileList) {
    return function (callback) {
        const indexLessPath = absPath('../src/index.less')
        const lessFileList = srcFileList.filter(filePath => /\.less$/.test(filePath) && filePath !== indexLessPath);
        const indexLessContents = lessFileList.map(filePath => {
            const relativePath = path.relative(path.dirname(indexLessPath), filePath);
            return `@import "${relativePath}";`
        }).join('\n')
        fs.writeFile(indexLessPath, indexLessContents, (err) => {
            if (err) throw err;
            callback()
        })
    }
}

function mkIndexTsx(srcFileList) {
    return function (callback) {
        const indexTsxPath = absPath('../src/index.tsx');
        const tsxFileMap = {};
        srcFileList.forEach(filePath => {
            const res = filePath.match(/\/src\/([A-Za-z0-9]+)\/index.tsx/)
            if (res && res[1]) {
                tsxFileMap[res[1]] = filePath;
            }
        })
        const indexTsxContents = Object.keys(tsxFileMap).map(key => {
            return `export {default as ${key}} from "${path.relative(path.dirname(indexTsxPath), tsxFileMap[key])}"`
        }).join('\n')
        fs.writeFile(indexTsxPath, indexTsxContents, err => {
            if (err) throw err;
            callback()
        })
    }

}



function autoImport() {
    const {fileList} = scanner(absPath('../src'));
    return parallel(mkIndexTsx(fileList), mkIndexLess(fileList))
}

function compileModules(type) {
    const outputPath = getOutPath(`npmPkg/${type}`)
    return function () {
        return src(inputPaths)
            .pipe(gulpIf(file => /\.tsx?/.test(file.extname),compileTsPlugin(isDev, type)))
            .pipe(dest(outputPath))
    }

}
// 模块
const compileToLib = compileModules('lib')
const compileToEs = compileModules('es')

// bundle
const compileToDist = (function () {
    const outputPath = getOutPath('npmPkg/dist');
    return series(
        autoImport(),
        function () {
            return src(absPath('../src/index.*'))
                .pipe(gulpIf(file => /\.less/.test(file.extname), compileLessPlugin(true)))
                .pipe(dest(outputPath))
        }
    )
})()

// copy
function copyFiles () {
    const outputPath = getOutPath('npmPkg');
    return src([absPath('../package.json'), absPath('../README.md')])
        .pipe(dest(outputPath))
}


const build = series(
    compileToDist,
    parallel(compileToLib, compileToEs, copyFiles)
)

// exports.dev = function(callback) {
//     watch(absPath('../src/**/*.*'), {
//         ignoreInitial: false,
//         delay: 500
//     } ,compileToDist)
//     callback()
// }

exports.default = build
