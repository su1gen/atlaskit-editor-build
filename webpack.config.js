const webpack = require("webpack")
const path = require('path')

module.exports = {
    mode: 'development',
    devtool: 'source-map',
    entry: {
        atlassianEditor: path.resolve(__dirname, "./src/index.tsx")
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].bundle.js',
        // filename: 'app.js',
        // path: __dirname
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(ts|tsx)$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
            },
        ]
    },
    resolve: {
        extensions: ['*', '.js', '.jsx', '.ts', '.tsx']
    },
    devServer: {
        contentBase: path.join(__dirname),
        compress: true,
        publicPath: '/dist/'
    }
}
