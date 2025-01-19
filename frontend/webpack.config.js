const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");


module.exports = {
    entry: './src/app.ts',
    mode: 'development',
    devtool: 'inline-source-map',
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
        output: {
            filename: 'app.js',
            path: path.resolve(__dirname, 'dist'),
            clean: true,
        },
        devServer: {
            static: {
                directory: path.join(__dirname, '.dist'),
            },
            compress: true,
            port: 9000,
            historyApiFallback: true,
        },
        plugins: [new HtmlWebpackPlugin({
            template: './index.html'
        }),
            new CopyPlugin({
                patterns: [
                    {from: './node_modules/vanilla-calendar-pro', to: 'vanilla-calendar-pro'},
                    {from: './node_modules/chart.js', to: 'chart.js'},
                    {from: "./src/templates", to: "templates"},
                    {from: "./src/css", to: "css"},
                    {from: "./node_modules/bootstrap/dist/css/bootstrap.min.css", to: "css"},
                    {from: "./node_modules/jquery/dist/jquery.min.js", to: "js"},
                    {from: "./node_modules/bootstrap/dist/js/bootstrap.bundle.js", to: "js"},
                    {from: "./src/static/images", to: "images"},
                ],
            }),
        ],
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: 'ts-loader',
                    exclude: /node_modules/,
                },
                {
                    test: /\.scss$/i,
                    use: [
                        "style-loader",
                        "css-loader",
                        {
                            loader: "sass-loader",
                            options: {
                                implementation: require("sass"),
                            },
                        },
                    ]
                },
            ],
        },
    }