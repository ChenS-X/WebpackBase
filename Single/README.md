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
