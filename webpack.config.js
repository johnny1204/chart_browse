const path = require('path')
const nodeExternals = require('webpack-node-externals')

module.exports = {
    mode: 'production',
    entry: './index.ts',
    externals: [nodeExternals()],
    output: {
        path: path.join(__dirname, "../dist"),
        filename: 'bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                loader: 'ts-loader',
                options: {
                    configFile: "tsconfig.json"
                }
            }
        ]
    },
    resolve: {
        alias: {
            "@": __dirname
        },
        extensions: ['.ts', '.js']
    }
}