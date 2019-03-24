var path = require('path');
var nodeExternals = require('webpack-node-externals');
var HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    mode: 'development',
    target: 'web',
    devtool: 'source-map',
    // node_modules配下のパッケージをWebpackに含まないように設定
    // externals: [nodeExternals()],
    entry: [path.join(__dirname, '/src/client/main.tsx')],
    output: {
        path: `${__dirname}/dist_client/lib/`,
        publicPath: '/lib/',
        filename: 'client_main.js'
    },
    module: {
        rules: [{
            // TypeScriptをコンパイル
            test: /\.ts$/,
            use: {
                loader: 'ts-loader',
                options: {
                    configFile: 'tsconfig-client.json',
                },
            }
        }, {
            test: /\.tsx?$/,
            use: {
                loader: 'ts-loader',
                options: {
                    configFile: 'tsconfig-client.json',
                },
            }
        }, {
            test: /\.html$/,
            use: {
                loader: 'html-loader'
            }
        }]
    },
    devServer: {
        contentBase: path.join(__dirname, 'dist/client'),
        open: true,
        port: 3000
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/client/index.html',
            filename: '../assets/index.html'
        })
    ],
    // main.ts以外のファイルをインポートするために必要
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".json"]
    },
};