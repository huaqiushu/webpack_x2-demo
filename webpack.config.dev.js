/**
 * Created by Administrator on 2018/4/17/017.
 */
var path=require("path");
var webpack=require("webpack");
var HtmlWebpackPlugin = require('html-webpack-plugin'); //生成html
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var autoprefixer = require('autoprefixer');

let cssExtract=new ExtractTextPlugin("style.[contenthash:8].css");
let sassExtract=new ExtractTextPlugin("index.[contenthash:8].css");

module.exports={
    devtool:'inline-source-map',
    entry: {
        app:"./src/index.js",
        a:"./src/a.js",
        vendor: ["react","jquery"]
    },
    output: {
        path: path.resolve(__dirname, "./bundle"),
        filename: "js/[name].[hash:8].js",
        chunkFilename:'js/[name].[hash:8].chunk.js'
        // publicPath: publicPath
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /^node_modules$/,
                loader: "babel-loader",
                query: {
                    presets: ['react', 'es2015', "stage-0"]
                }
            },
            {
                test: /\.jsx$/,
                exclude: /^node_modules$/,
                loader: 'babel-loader',
                query: {
                    presets: ['react', 'es2015', "stage-0"]
                }
            },
            // {test: /\.css$/, loader: ExtractTextPlugin.extract('style','css')},
            {
                test: /\.css$/,
                exclude: /^node_modules$/,
                loader: cssExtract.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader:'css-loader', options:{importLoaders:1}
                        },
                        'postcss-loader'
                    ]
                })
            },
            {
                test: /\.scss$/,
                exclude: /^node_modules$/,
                loader: sassExtract.extract({
                    fallback: 'style-loader', 
                    use: 'css-loader!postcss-loader!sass-loader'
                })
            },
            // {test: /\.scss$/, loader: ExtractTextPlugin.extract('style','css!sass')}，
            {
                test: /\.(jpg|png|gif)$/,
                exclude: /^node_modules$/,
                loader: "url-loader",
                query: {
                    limit: 10000
                }
            }
        ]
    },
    plugins: [
        cssExtract,
        sassExtract,
        new webpack.LoaderOptionsPlugin({
            options: {
                postcss: function () {
                    return [autoprefixer({
                        browsers: [
                            '>1%',
                            'last 4 versions',
                            'Firefox ESR',
                            'not ie < 9' // React doesn't support IE8 anyway
                        ]
                    })];
                }
            }
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: ["vendor","manifest"]
        }),
        new webpack.ProvidePlugin({ $: "jquery",  jQuery: "jquery",  "window.jQuery": "jquery"  }),
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({ //根据模板插入css/js等生成最终HTML
            title: '注册1',
            template: 'index.html',//html模板路径 
            inject: 'body',
            filename: 'index.html',   //输出html文件的位置 相对于 path
            hash: true,    //为静态资源生成hash值
            chunks:["vendor","manifest","app"]
        }),
        // new HtmlWebpackPlugin({ //根据模板插入css/js等生成最终HTML
        //     title: '注册2',
        //     template: 'a.html',//html模板路径
        //     inject: 'body',
        //     filename: './aHtml/a.html',   //输出html文件的位置 相对于 path
        //     hash: true,    //为静态资源生成hash值
        //     chunks:["a"]
        // }),
        new webpack.DefinePlugin({ //将环境切换到生产环境，将React切换到产品环境 (同时要设置)
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV)
            },
            PRODUCTION: JSON.stringify(false)
        })
    ],
    devServer: {
        hot: true,
        port: 3002,
        inline: true
    }
};