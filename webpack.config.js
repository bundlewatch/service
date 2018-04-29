const slsw = require('serverless-webpack')
const nodeExternals = require('webpack-node-externals')
const CopyWebpackPlugin = require('copy-webpack-plugin')

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
    plugins: [new CopyWebpackPlugin(['src/static/*', 'src/views/*'])],
}

module.exports = config
