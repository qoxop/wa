const {spawn} = require('child_process')

process.env.NODE_ENV = 'development'

const childrenProcess = spawn(
    'node',
    [
        require.resolve('webpack-dev-server/bin/webpack-dev-server'),
        '--config',
        require.resolve('./webpack.dev')
    ]
)

childrenProcess.on('exit', console.log)