var path = require('path');
var nodeExternals = require('webpack-node-externals');
module.exports = {
    mode: 'development',
    target: 'web',
    devtool: 'source-map',
    // node_modules配下のパッケージをWebpackに含まないように設定
    // externals: [nodeExternals()],
    entry: [path.join(__dirname, '/src/client/main.tsx')],
    output: {
        path: `${__dirname}/dist/client/`,
        filename: 'main.js'
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
        }]
    },
    // main.ts以外のファイルをインポートするために必要
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".json"]
    },

};
