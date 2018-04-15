const slsw = require('serverless-webpack')
const nodeExternals = require('webpack-node-externals')

const config = {
    entry: slsw.lib.entries,
    target: 'node',
    externals: [nodeExternals()],
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: __dirname,
                exclude: /node_modules/,
            },
        ],
    },
    plugins: [],
}

module.exports = config
