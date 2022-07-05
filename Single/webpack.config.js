const path = require('path'); // 引入path
const resolve = _path => path.resolve(__dirname, _path); // 声明resolve函数，方便调用拼接路径
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {
    CleanWebpackPlugin
} = require('clean-webpack-plugin'); // 打包时删除上一次打包生成的dist文件
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// 处理在htnml中引入静态资源
const CopyWebpackPlugin = require('copy-webpack-plugin');

const isProd = process.env.NODE_ENV === 'production'; // 判断环境，需要借助cross-env，且修改package.json的执行命令，指定开发环境。
// console.log('isProd:', isProd);
const prodPlugins = []; // 此变量用于存放开发环境production下需要的插件
if (isProd) {
    prodPlugins.push(new MiniCssExtractPlugin({
        filename: 'static/css/[name].[contenthash:10].css', // 规定分离css后打包的文件名称
        chunkFilename: 'static/css/[id].[contenthash:10].css'
    }))
}

const TerserPlugin = require('terser-webpack-plugin'); //  webpack5内置Terser压缩，不需要单独安装

module.exports = {
    entry: './src/index.js', // 指定入口文件
    output: {
        path: resolve('dist'), // 将文件打包到/dist文件路径下
        filename: 'bundle.[hash].js', // 打包成功后的js文件名称为 bundle.js
        // 静态文件打包后的路径及文件名（默认是走全局的assetModuleFilename，如果有独立设置就按照独立设置的来）
        assetModuleFilename: 'static/assets/[name].[hash][ext]'
    },
    // 配置压缩
    optimization: {
        minimize: true, // 是否压缩
        minimizer: [
            new TerserPlugin({ // webpack5内置Terser压缩
                extractComments: false, // 不将注释提取到单独的txt文件
            })
        ]
    },
    devServer: {
        hot: true,
    },
    resolve: {
        // 配置省略文件路径后缀名
        extensions: ['.js', '.ts']
    },
    module: {
        rules: [{
                test: /\.(sa|sc|c)ss$/,
                use: [
                    // 判断，如果是开发环境，则使用style-loader， 如果是发布的话，就分离css
                    isProd ? MiniCssExtractPlugin.loader : 'style-loader',
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [
                                    'postcss-preset-env'
                                ],
                            },
                        },
                    },
                    'sass-loader'
                ]
            },
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            [
                                '@babel/preset-env',
                                {
                                    useBuiltIns: 'usage', // corejs按需加载
                                    corejs: 3, // 配置corejs的版本
                                    // 适配的浏览器版本 >= 
                                    // targets: {
                                    //     chrome: '50',
                                    //     firefox: '50',
                                    //     ie: '6',
                                    //     edge: '18',
                                    //     safari: '10'
                                    // },
                                    // 使用browsers
                                    targets: {
                                        browsers: ["> 1%", "last 2 versions", "not ie <= 6"]
                                    }
                                }
                            ]
                        ]
                    }
                }
            },
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            // {
            //     // webpack4需要安装url-loader和file-loader

            //     // 处理图片文件的规则安装指令：cnpm i url-loader file-loader  -D
            //     test: /\.(png|jpe?g|gif|gif|svg)(\?.*)?$/,
            //     loader: "url-loader",
            //     options: {
            //         limit: 80 * 1024, // 当图片小于80kb时采用base64的方式打包，大于则以图片形式打包。
            //         name: "[hash:10].[ext]", // 每次webpack构建打包会生成一串不重复的hash码，[hash:10]则是去hash的前十位，[ext]取源文件的后缀名。
            //         outputPath: "static/img", // 输出目录，output定义了输出目录为build，此处图片输出目录为build/static/img/XXX文件。
            //         esModule: false, // 默认使用es6语法解析，html-loader使用的是commonjs语法引入，但2020年09月24日不用关闭url-loader的es6解析方法。
            //     },
            // },
            {
                // webpack内置url-loader和file-loader
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                type: 'asset',
                // 配置url转data（base64）
                parser: {
                    dataUrlCondition: {
                        // 相当于webpack4时url-loader的limit
                        maxSize: 10 * 1024 // 设置小于10kb的图片资源转为base64
                    }
                },
                // 单独配置打包后输出的路径和文件名称
                generator: {
                    filename: 'static/assets/images/[name].[hash][ext]'
                }
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac|woff2?|eot|ttf|otf)(\?.*)?$/,
                type: 'asset/resource',
                generator: {
                    // 此处针对字体文件配置，当然了MP4等音视频文件其实最好分开写，这里只是做演示
                    filename: 'static/assets/fonts/[name].[hash:10][ext]'
                }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html'
        }),
        new CleanWebpackPlugin(),
        // 注意，使用copywebpackplugin插件在html文件中引用静态资源是，页面上写src路径是安装打包后的路径写的。
        // 此时注意下方from和to的文件路径，基于当前项目的接口，我希望在public/index.html中以img:src="./assets/images/xxx.png"的方式
        // 引用图片文件是有问题的，因为to属性定义了输出路径，所以在public/index.html中写img:src="./static/assets/images/xxx.png"才可以
        // 正常访问到资源。但是这样在开发时会有一个问题，就是我希望我在index.html中写路径时可以提示，且不用担心是否和输出路径一致。那么我们
        // 可以在public文件夹下以和输出路径一样的文件结构，比如我现在的输出路径静态资源时static/assets下的，那么我在public文件夹下也依照
        // static/assets的文件结构存放静态资源，这样就可以开发时写路径有提示，并且不用担心打包后加载不到资源的问题了。

        // 修改下面的Copywebpackplugin配置，同时修改public的文件结构：
        new CopyWebpackPlugin({
            patterns: [{
                from: resolve('public/static'),
                to: resolve('dist/static'), // 这是资源copy到输出目录的路径
                toType: 'dir', // 将from下的文件以文件夹的形式copy到输出路径
                // 过滤html文件
                filter: resourcePath => {
                    return !/\.html$/.test(resourcePath)
                }
            }]
        }),
        // 此处是production环境的插件
        ...prodPlugins
    ]
}