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

8. CSS处理
> webpack本身只能对js和json做识别，对于诸如css等的语言并不识别，所以衍生出很多`loader`，`loader`用于将css等webpack不识别的语言转换为webpack识别的，进而能让webpack具备打包对应语言的能力。有时间再复习一下`loader`和`plugin`相关的知识。

> 回到对CSS的处理，需要一下两个`loader`：`css-loader`，`style-loader`。使用npm安装
```js
npm i -D css-loader style-loader
```
