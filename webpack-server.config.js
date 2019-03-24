var path = require('path');
var nodeExternals = require('webpack-node-externals');
module.exports = {
    mode: 'development',
    target: 'node',
    devtool: 'source-map',
    // node_modules配下のパッケージをWebpackに含まないように設定
    externals: [nodeExternals()],
    entry: [path.join(__dirname, '/src/server/main.ts')],
    output: {
        path: `${__dirname}/dist_server/bin/`,
        filename: 'server_main.js'
    },
    module: {
        rules: [{
            // TypeScriptをコンパイル
            test: /\.ts$/,
            exclude: [/node_modules/],
            use: {
                loader: 'ts-loader',
                options: {
                    configFile: 'tsconfig-server.json',
                },
            }
        }, {
            // javascriptをコンパイル
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader'
            }
        }]
    },
    devServer: {
        contentBase: path.join(__dirname, 'dist/client'),
        open: true,
        port: 3000
    },
    // main.ts以外のファイルをインポートするために必要
    resolve: {
        extensions: ['.ts','.js']
    }
};