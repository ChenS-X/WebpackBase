# Webpack的基本配置，单文件版本
注：单文件版本主要是用于区分与按环境区分dev.config.js和prod.config.js，用一个webpack.config.js写webpack配置的版本。

1. 安装node环境
```js
npm init -y
```
2. 安装webpack相关的库
```
npm i -D webpack webpack-cli
```
3. 新建`webpack.config.js`文件，然后开始指定`entry`/`output`等参数
```js
const path = reuqire('path'); // 引入path
const resolve = _path => path.resolve(__dirname, _path); // 声明resolve函数，方便调用拼接路径

module.exports = {
    entry: './src/index.js', // 指定入口文件
    output: {
        path: resolve('dist'), // 将文件打包到/dist文件路径下
        filename: 'bundle.js' // 打包成功后的js文件名称为 bundle.js
    }
}
```
4. 在`package.json`配置`scripts`命令
```json
{
    "scripts": {
        "dev": "webpack --mode development",
        "build": "webpack --mode production"
    }
}
```
5. 新建`src`文件夹，然后在`src`文件夹中新建`index.js`，作为webpack打包的入口文件，当然并非一定要命名为index.js，名字随意，只要和上述`webpack.config.js`的`entry`属性对应上即可。
```js
// index.js

function sum(a, b) {
    return a + b;
}
var a  = 10;
console.log(sum(a, 10));
```

按照上述步骤，此`webpack`项目已经初步具备打包的功能了。此时在终端中执行
```
npm run dev
```
就会发现项目中会生成一个`dist`文件夹，内有`bundle.js`文件，这和我们刚才配置的`output`属性是匹配的。

在`package.json`中我们指定了两个命令，分别指定了`mode`参数分别`development`开发环境，`production`生产环境。`webpack`在默认情况下在`production`环境下打包，会自动压缩js文件。当然了，压缩规则啥的我们是可以自己手动配置的。

可以看一下在默认的情况下，`development`和`production`环境下打包出来的`bundle.js`的区别
> development
```js
// development下打包的出来bundle.js，含有注释，没有压缩
/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ (() => {

eval("function sum(a, b) {\r\n    return a + b;\r\n}\r\nvar a  = 10;\r\nconsole.log(sum(a, 10));\n\n//# sourceURL=webpack://Single/./src/index.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/index.js"]();
/******/ 	
/******/ })()
;
```
> production
```js
// production下打包出来的bundle.js，没有注释，且简化压缩

console.log(20);
```

目前，配置`webpack`已经能够打包项目了。但是功能还比较弱。没办法对Ts，css，scss，图片字体等资源进行识别打包。也没有做一些优化压缩的处理。所以接下来的目标就是往这方面去做。

6. HTML处理
> 使用`html-webpack-plugin`插件，使得webpack支持html文件的打包，配合`webpack-dev-server`插件，在开发时`webpack`开启一个服务。
```js
// 使用npm安装html-webpack-plugin和webpack-dev-server
npm i -D html-webpack-plugin webpack-dev-server
```
> 然后在项目中新建一个文件夹`public`，在此文件夹中创建一个`index.html`文件。接下来就是在`webpack.config.js`中对`html-webpack-plugin`进行配置，使其生效。
```js
// 引入安装好的html-webpack-plugin
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    entry: './src/inde.js'
    ...
    plugins: [ // 插件使用在plugins中
        new HtmlWebpackPlugin({
            title: '我负责设置打包后生成的html文件的title',
            template: './public/index.html', // 设置template属性，设置html模板，打包后生成的html文件会根据此设置关联的public/index.html进行生成
        })

    ]
}
```
> 此时，我们需要修改`package.json`中的`scripts`命令
```json
{
    "scripts": {
        "dev": "webpack server --port 3000 --open --mode development"
    }
}
```
> 上面的命令解析：webpack server --port 3000 --open --mode development：使用webpack-dev-server开启的服务器，使用3000端口，open打开浏览器。

> 此时，在终端输入`npm run dev`命令之后，就会在localhost:3000打开我们写好的htnml文件，并将`bundle.js`引入到html中生效。

> 此时，运行`npm run build`命令之后，可以看到在`dist`文件中生成了一个`index.html`，此html问title修改为我们设置的属性，然后html结构和`public/index.html`中一样，而且可以看到生成的`bundle.js`也被自动地引入到生成的`index.html`中。

7. 热更新
> 开发时希望“所见即所得”，就是代码中做出的修改，立马就可以显示在页面上，鉴于此，我们可以利用`webpack`的`热更新`机制。因为之前已经安装好了`webpack-dev-server`插件，我们需要在`webpack.config.js`中配置一下`devServer`中`hot:true`。注意：`devServer`和`entry`等属性是同一级的。
```js
devServer: {
    hot: true,
},
```
经过上述配置之后，尝试在index.html加一个p标签，随便写点文字，然后保存，此时回到页面行，不需要我们手动刷新，热更新机制已经帮我们自动刷新，然后显示最新的结果了。


8. CSS处理
> webpack本身只能对js和json做识别，对于诸如css等的语言并不识别，所以衍生出很多`loader`，`loader`用于将css等webpack不识别的语言转换为webpack识别的，进而能让webpack具备打包对应语言的能力。有时间再复习一下`loader`和`plugin`相关的知识。

> 回到对CSS的处理，需要一下两个`loader`：`css-loader`，`style-loader`。使用npm安装
```js
npm i -D css-loader style-loader
```
配置`webpack`对`css`的处理
```js
// webpack
module: {
    rules: [
        {
            test: /\.css$/,
            use: [
                'style-loader',
                'css-loader'
            ]
        }
    ]
}
```
**注意：`module`和`entry`同级。**
> 上面的配置解析：
`webpak`中对`loader`的配置均写在`module`属性中，在`module`属性中有`rules`属性，该属性规定`loader`的规则。可以看到的是，`rules`中写一个对象，对象对应的`test`属性为正则表达式，用于过滤文件的。在`css`处理中，`test`过滤获取是以`.css`后缀的文件，`use`属性写需要使用的`loader`。此处需要注意的是，`loader`的执行顺序是**从下至上（从右到左）**的。在此例子中，可以认为当遇到以`.css`结尾的文件，先用`css-loader`将`css`转成`webpack`能够识别的代码，然后再用`style-loader`将`css样式`作用于页面元素上。

> 如果遇到loader需要传递配置参数时，可以使用对象+loader属性代替loader字符串，如下：postcss
```js
// 以postcss为例子
module: {
    rules: [
        {
            test: /\.css$/,
            use: [
                'style-loader',
                'css-loader',
                {
                    loader: 'postcss-loader',
                    options: {
                        postcssOptions: {
                            plugins: [
                                'postcss-preset-env'
                            ]
                        }
                    }
                }
            ]
        }
    ]
}
```

此时，在`src`目录下新建`style`文件夹，然后在`style`文件夹中新建`base.css`,些下样式：
```css
/*base.css*/
body{
    background:pink;
}
```
然后在`index.js`中以`import`的方式引入刚才创建的`base.css`，保存后就可以看到`body`样式已经作用上了。
```js
// index.js
import './style/base.css';
// ...
```

9. css3兼容，`postcss-loader`的使用
> 安装`postcss`相关库，运行如下命令
```
npm i -D postcss-loader postcss postcss-preset-env
```
> 修改`webpack.config.js`中的`module.rules`，在`css-loader`后加入如下代码：
```js
{
    test: /\.css$/,
    use: [
        'style-loader',
        'css-loader',
        {
            loader: 'postcss-loader',
            options: {
                postcssOptions: {
                    plugins: [
                        'postcss-preset-env'
                    ]
                }
            }
        }
    ]
}
```
> 此时，分别在`base.css`和`index.html`中加入如下代码：
```css
/* base.css */
.rotating {
    width: 100px;
    height: 100px;
    background: red;
    animation: rotated 1s linear 0s infinite;
}
@keyframes rotated {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
```
```html
<!-- index.html -->
<div class="rotating"></div>
```
> 保存代码后，此时页面上就会多出一个旋转的`div`方块，浏览器中检查此元素，会发现`animation`属性被自动加上了`-webkit-`前缀（chrome浏览器）


10. scss预处理器的支持
> 运行命令，安装`sass-loader`和`node-sass`
```npm
npm i -D sass-loader node-sass
```
> 修改`webpack.config.js`中`module.rules`：
```js
module: {
    rules: [
        {
            test: /\.(sa|sc|c)ss$/, // 检测scss，sass，css
            use: [
                'style-loader',
                'css-loader',
                {
                    loader: 'postcss-loader',
                    options: {
                        postcssOptions: {
                            plugins: [
                                'postcss-preset-env'
                            ]
                        }
                    }
                },
                'sass-loader' // .sass 和 .scss文件处理
            ]
        }
    ]
}
```

11. babel实现编译ES6+
> 运行命令，安装`@babel/core`，`@babel/preset-env`，`babel-loader`:
```
npm i -D @babel/core @babel/preset-env babel-loader
```
> 修改`webpack.config.js`中`module.rules`添加一条对js文件的规则:
```js
module: {
    rules: [
        ...,
        {
            test: /\.m?js$/,
            exclude: /node_modules/, // 排除node_modules中的文件
            use: {
                loader: 'babel-loader',
                options: {
                    presets: [
                        [
                            '@babel/preset-env'
                        ]
                    ]
                }
            }
        }
    ]
}
```
> 此配置之后，仅仅可以将诸如`const`，`let`，箭头函数等编译成ES5，但是对于`Promise`等，还需要`core-js`库来导入。可以将`core-js`理解为一个包含了许多ES6+实现的兼容库，解决`polyfill`问题。运行命令安装`core-js`：
```
npm i -D core-js
```
然后修改`webpack.config.js`中`bable`的配置。
```js
module: {
    ...,
    {
        test: /\.m?js$/,
        exclude: /(node_modules)|(bower-components)/,
        use: {
            loader: 'babel-loader',
            options: {
                presets: [
                    [
                        'babel-loader',
                        {
                            usesBuiltIns: 'usage', // corejs按需加载
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
    }
}
```
此时，在`index.js`中加入一句`console.log(Promise)`，然后运行打包命令，此时会发现生成的`build.js`中多出了`Promise`的`polyfill`兼容版本。

12. 支持TypeScript
> 安装`ts-loader`,`typescript`
```js
npm i -D ts-loader typescript
```
修改`webpack.config.js`的`module.rules`配置，增加一项是对`ts`的配置，如下：
```js
module: {
    rules: [
        ...,
        {
            test: /\.tsx?$/,
            use: 'ts-loader'
        }
    ]
}
```
接着在`webpack.config.js`同级目录下，新建一个`tsconfig.json`的文件，配置ts编译的相关规则：
```js
// 注意，真实的json文件不能加注释，此处只是作为演示使用
{
    "compilerOptions": {
        "module": "ES6", // 编译前的
        "target": "ES3", // 编译后的
        "strict": true, // 是否采取严格模式
        "noEmitOnError": true // 出错后是否还正常输出
    }
}
```
这个时候吗，项目就已经具备支持TS开发的能力了。可以在项目中新建ts文件予以检测。

13. 分离css
> 现在运行`npm run build:prod`时，js和css都是杂糅在bundle.js中的。可以安装`mini-css-extract-plugin`插件，将css从bundle.js中独立出来。
```
npm i -D mini-css-extract-plugin
```
我们希望当*development*环境时不分离css，这样编译速度加快，但是当打包上线时（*production*）时分离css。这个时候就需要对不同的开发环境做配置了。
```js
// webpack.config.js
const path = require('path'); // 引入path
const resolve = _path => path.resolve(__dirname, _path); // 声明resolve函数，方便调用拼接路径
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {
    CleanWebpackPlugin
} = require('clean-webpack-plugin'); // 打包时删除上一次打包生成的dist文件
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isProd = process.env.NODE_ENV === 'production'; // 判断环境，需要借助cross-env，且修改package.json的执行命令，指定开发环境。
console.log('isProd:', isProd);
const prodPlugins = []; // 此变量用于存放开发环境production下需要的插件
if (isProd) {
    prodPlugins.push(new MiniCssExtractPlugin({
        filename: '[name].[hash].css', // 规定分离css后打包的文件名称
    }))
}

const TerserPlugin = require('terser-webpack-plugin'); //  webpack5内置Terser压缩，不需要单独安装

module.exports = {
    entry: './src/index.js', // 指定入口文件
    output: {
        path: resolve('dist'), // 将文件打包到/dist文件路径下
        filename: 'bundle.[hash].js' // 打包成功后的js文件名称为 bundle.js
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
                    isProd ? {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: './'
                        }
                    } : 'style-loader',
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
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html'
        }),
        new CleanWebpackPlugin(),
        // 此处是production环境的插件
        ...prodPlugins
    ]
}
```
此时，上方的`webpack.config.js`中的*process.env.NODE_ENV*是`undefined`，需要修改*package.json*的指令，在执行环境中加入`NODE_ENV`变量。这里需要安装`cross-env`来处理跨平台兼容。
```
npm i -D cross-env
```
然后修改`package.json`的`scripts`执行命令
```js
// 原有的package.json的scripts命令
{
    "scripts": {
        "dev": "webpack server --port 3001 --open --mode development",
        "build:dev": "webpack --mode development",
        "build:prod": "webpack --mode production"
    }
}
```
```js
// 加入cross-env，指定执行环境之后的scripts命令
{
    "scripts": {
        "dev": "cross-evn NODE_ENV=development webpack server --open --port 3002",
        "build:dev": "cross-env NODE_ENV=development webpack",
        "build:prod": "cross-env NODE_ENV=production webpack"
    }
}
```
此时在运行*npm run build:prod*时，会发现dist生成的文件中多出了css文件，而且该css文件被自动的在*dist/index.html*中引用了。

14. 处理静态资源
* 静态资源`copy-webpack-plugin`
> html文件中直接引用静态图片
运行命令安装`copy-webpack-plugin`
```
npm i -D copy-webpack-plugin
```
修改`webpack.config.js`配置
```js
const CopyWebpackPlugin = require('copy-webpack-plugin'); // 引入插件
module.exports {
    plugins: [
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
    ]
}
```
此时在`public`文件加下的静态资源文件就可以在html中引入了。需要注意的是，html引入资源的路径是根据打包生成后的路径来写。



+ 静态资源`url-loader` `file-loader`（webpack5不需要安装，已内置）
> 在*css*中使用的静态资源，或者使用*import/require*引入的资源
+ *webpack4*运行安装命令
```
npm i -D url-loader file-loader
```
修改`webpack.config.js`的`module.rules`配置
```js
module: {
    rules: [
        ...,
        {
            // webpack4需要安装url-loader和file-loader

            // 处理图片文件的规则安装指令：cnpm i url-loader file-loader  -D
            test: /\.(png|jpe?g|gif|gif|svg)(\?.*)?$/,
            loader: "url-loader",
            options: {
                limit: 80 * 1024, // 当图片小于80kb时采用base64的方式打包，大于则以图片形式打包。
                name: "[hash:10].[ext]", // 每次webpack构建打包会生成一串不重复的hash码，[hash:10]则是去hash的前十位，[ext]取源文件的后缀名。
                outputPath: "static/img", // 输出目录，output定义了输出目录为build，此处图片输出目录为build/static/img/XXX文件。
                esModule: false, // 默认使用es6语法解析，html-loader使用的是commonjs语法引入，但2020年09月24日不用关闭url-loader的es6解析方法。
            },
        },
    ]
}
```
+ *webpack5*
修改*webpack.config.js*的*module.rules*配置
> 可通过在`output`属性的`assetModuleFilename`，也可以在`rule`中直接利用`generator.filename`配置输出路径和文件名称。
```js
module: {
    rules: [
        ...,
        {
            test: /\.(png|jpe?g|gif|gif|svg)(\?.*)?$/,
            type: 'asset', // 配置type = asset，让wenpack自己选择是输出文件还是转data（base64）
            parser: {
                dataUrlCondition: {
                    // 配置当图片资源小于10kb时转成data:base64，不输出文件
                    maxSize: 10 * 1024
                }
            },
            generator: {
                // 单独配置图片文件打包输出的文件路径和文件名称
                filename: 'static/images/[name].[hash:10][ext]', 
            }
        }
    ]
}
```
解析：资源模块*asset module type*的值：
```js
'asset/resource': 导出资源，可配置generator.filename设置打包输出的文件路径和名称
'asset/inline': 将资源转成base64
'asset/source': 读取资源内容,用于到处资源的源代码，比如导出一个`txt`格式文本文件
'asset': 通用数据类型自动转换，可通过parser配置 
```

+ 导入音视频，iconfont等文件`webpack5`，增加`rule`
```js
module: {
    rules: [
        {
            test: /\.(mp4|mp3|webm|ogg|wav|flac|acc|woff2?|eot|ttf|otf)(\?.*)?$/,
            type: 'asset/resource'
        }
    ]
}
```
从阿里图标下载代码，解压后将`iconfont.css`和`iconfont.ttf`(`eot`等图标文件)放到`src`文件夹中，放到一个*font*文件夹。
在`index.css`中，`@import url(../../字体css文件名称.css)`导入。


15. 引入Vue3开发
> 安装 `vue@next`和`vue-loader@next`以及`@vue/compiler-sfc`，使得项目支持`vue`和`.vue`文件。
```js
npm i -D vue@next

npm i -D vue-loader@next @vue/compiler-sfc // 让webpack支持单文件组件（sfc）
```
修改`webpack.config.js`配置`VueLoaderPlugin`和`vue-loader`。
```js
const { VueLoaderPlugin } = require('vue-loader');

module.exports = {
    ...,
    plugins: [
        new VueLoaderPlugin()
    ],
    module: {
        rules: [{
            test: /\.vue$/,
            use: 'vue-loader'
        }]
    }
}
```
由于当前项目为`webpack`综合项目，主要用于展示`webpack`使用，以后可能还会集成`React`等其他的前端框架，所以此处我们可以使用启动命令区分不同的前端框架开发。修改`package.json`的`scripts`，如下：
```js
// package.json
...,
"scripts": {
    "dev": "cross-env NODE_ENV=development webpack server --open --port 3002",
    "dev:vue": "cross-env NODE_ENV=development PLATFORM=VUE webpack server --open --port 3001",
    "build:dev": "cross-env NODE_ENV=development webpack",
    "build:prod": "cross-env NODE_ENV=production webpack"
}
```
然后修改`webpack.config.js`中对于`vue`的配置
```js
// webpack.config.js
const { VueLoaderPlugin } = require('vue-loader'); // 导入VueLoaderPlugin插件
const isVue = process.env.PLATFORM === 'VUE'; // 判断是否为vue平台
const vuePlugins = [];
if(isVue) {
    vuePlugins.push(new VueLoaderPlugin())
}

module.exports = {
    // 修改模板html
    entry: isVue ? './src/vue/main.js' : './src/index.js';
    ...,
    // 配置vue插件
    plugins: [
        new HtmlWebpackPlugin({
            template: isVue ? './public/vue.html' : './public/index.html'
        }),
        ...vuePlugins,
    ]
}
```
在`public`文件夹中新建一个`vue.html`，如下：
```html
<!-- vue模板html -->
<!DOCTYPE html>
<html lang="en">

<head>
    <title>Vue</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
</head>

<body>
    <div id="app"></div>
</body>

</html>
```
在`src`下新建一个文件夹`vue`，以后`vue`相关开发文件都存放到这个路径下。在此`vue`文件夹下新建`main.js`和`App.vue`，分别如下：
```vue
<!-- vue/App.vue -->
<template>
  <div class="main">
    <h1>{{ title }}</h1>
  </div>
</template>

<script>
import { reactive, toRefs } from 'vue';
export default {
  setup() {
    const state = reactive({
        title: 'nihao1111'
    })

    return {
        ...toRefs(state)
    }
  }
};
</script>

<style>
</style>
```
```js
// vue/main.js
import { createApp } from 'vue';
import App from '@/vue/App';

createApp(App).mount('#app');
```
此时，执行命令`npm run dev:vue`，等待刷新出来的浏览器结果。