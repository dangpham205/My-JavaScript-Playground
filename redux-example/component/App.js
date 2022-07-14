import toHtml from "../core.js";
import {connect} from "../store.js"


// giá trị mặc định của state là 'bmw'
// hàm connector sẽ đc gán hàm return của connect(), arrow func nhận đối sô là component
// nên khi gọi bên dưới truyền vô component App
// và khi chạy connector(App), thì hàm sẽ return component(Object.assign({}, props, selector(state), ...args))
// mà component đang là App ===> chạy hàm App({cars})
const connector = connect() 

// chạy connect thì sẽ trả về props(cars)
function App({ cars }) {
    return toHtml`
        <h1>${false}</h1>
        <ul>
            ${cars.map(function(car) {
                return `<li>${car}</li>`
            })}
        </ul>
        <button onclick="dispatch('ADD', 'Urus')">Add Car</button>
    `
    // return toHtml`
        // <h1>hello</h1>
    // `
}

export default connector(App)