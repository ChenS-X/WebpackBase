// function sum(a, b) {
//     return a + b;
// }
// var a  = 10;
// console.log(sum(a, 10));

// 使用import引入base.css
import './style/css/base.css';
import './style/css/index.scss';

import { testFunc } from './lib/test';

function randomStr() {
    return Math.random() + '';
}

console.log(testFunc(randomStr()));
// const a = 10;
// const b = async function() {
//     console.log(a);
// }
// b();