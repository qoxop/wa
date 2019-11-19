module.exports = {
    presets: [
        [
            "@babel/preset-env",
            {
                "targets": {
                    "browsers": ["Android >= 4.0", "ios >= 8"],
                    "esmodules": false,
                },
                "modules": false,
                "useBuiltIns": false,
            }
        ],
        ["@babel/preset-react"],
        ["@babel/preset-typescript", {isTSX: true, allExtensions: true, jsxPragma: 'React'}]
    ],
    plugins: [
        ['@babel/plugin-proposal-class-properties'],
        [
            "@babel/plugin-transform-runtime",
            {
                corejs: 3,
                helpers: true,
                regenerator: true,
                useESModules: false
            }
        ]
    ]
}