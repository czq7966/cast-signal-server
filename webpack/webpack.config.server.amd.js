const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

module.exports = env => {
    env = env ? env : {}; //环境变量
    const mode = env.production ? "production" : "development"; //开发或生产模式
    const devtool = env.production || env.nodevtool ? "" : "source-map"; //
    const entry = {}; 
    const plugins = [];
    const optimization = {};  //优化选项
    const minimizer = []; //优化选项：瘦身器
    const externals = [nodeExternals({ modulesFromFile: true })];
    const libraryTarget = env.amd ? 'amd' : env.umd ? 'umd' :  env.cjs ? 'commonjs' : env.old ? 'umd' : 'commonjs';
    // const libraryTargetPath =  env.amd ? 'amd' : env.umd ? 'umd' : env.cjs ? 'cjs' : env.old ? '' : 'cjs';
    // const distDir = path.resolve(__dirname, 'dist', libraryTargetPath);
    const distDir = path.resolve(__dirname, env.distDir ? env.distDir : '../dist/server/amd');
    const srcDir =  path.resolve(__dirname, '../src/server/amd');
    entry['common/index'] = path.resolve(srcDir, "common/namespace.ts");
    entry['cert-watcher/index'] = path.resolve(srcDir, "cert-watcher/index.ts");
    entry['admin/index'] = path.resolve(srcDir, "admin/index.ts");
    entry['signal-center/index'] = path.resolve(srcDir, "signal-center/index.ts");
    entry['signal-client/index'] = path.resolve(srcDir, "signal-client/index.ts");
    entry['redis-signaler/index'] = path.resolve(srcDir, "redis-signaler/index.ts");
    entry['ota/index'] = path.resolve(srcDir, "ota/index.ts");

    
    optimization['minimizer'] = minimizer;  

    plugins.push(
        new CopyWebpackPlugin([
            {
                from: path.resolve(srcDir, 'redis-signaler' , 'redundancy.lua'),
                to: path.resolve(distDir, 'redis-signaler' , 'redundancy.lua'),
            }              
        ]),        
    )

    if (env.production) { //生产模式
        minimizer.push(
            new UglifyJsPlugin()
        )
    }

    const node = {
        __dirname: false,
        __filename: false,
        process: false
    }


    return {
        mode: mode,
        entry: entry,
        devtool: devtool,
        output: {
            path: distDir,
            libraryTarget: libraryTarget,
            filename: "[name].js"
        },
        resolve: {
            extensions: [".ts", ".tsx", ".js"]
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    loader: "ts-loader",
                    exclude: /node_modules/
                },
                {
                    test: /\.css$/,
                    loader: "style-loader!css-loader",
                    exclude: /node_modules/
                },
            ]
        },
        plugins: plugins,
        optimization: optimization,
        plugins: plugins,
        externals: [
            nodeExternals({ modulesFromFile: true }),
            {
                './package.json': '../../package.json',
                './config.json': '../../config.json',
                'fs': 'fs',
                'path': 'path',
                'http': 'http',
                'https': 'https',
                'zlib': 'zlib',
                'socket.io-client': 'socket.io-client'
            }

        ],
        node: node
    }
}

