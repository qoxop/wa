const fs = require('fs')

require("@babel/core").transformFile('../src/components/Button/index.tsx', {
    presets: ["@babel/preset-typescript", {allExtensions: true, isTSX: true}]
}, (err, res) => {
    if (err) throw  err;
    fs.writeFileSync('./temp/code.js', res.code)
    fs.writeFileSync('./temp/code.js.map', res.map)
})
