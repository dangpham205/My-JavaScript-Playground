// import toHtml from './core.js'

// const cars = ['xe 1', 'xe 2', 'xe 3']

// const isSuccess = false

// const output = toHtml`
//     <h1>${false}</h1>
//     <ul>
//         ${cars.map(function(car) {
//             return `<li>${car}</li>`
//         })}
//     </ul>
// `

// console.log(output)

import { attach } from "./store.js";
import App from './component/App.js'


// truyền component App vào cái root (key: root, value: component (App))
// sau đó hàm render() đc  gọi 
// trong hàm render(), vì component App là 1 cái hàm (App.js), nên hàm render gán output bằng component() 
// và cuối cùng là gán innerHtml vô root để render ra view
attach(App, document.getElementById('root'))