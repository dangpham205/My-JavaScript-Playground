import toHtml from "../core.js";
import Header from "./Header.js";
import TodoList from "./TodoList.js";
import Footer from "./Footer.js";
// import connect mới lấy đc dữ liệu trong store
import {connect} from "../store.js";

// giá trị mặc định của state là 'bmw'
// hàm connector sẽ đc gán hàm return của connect(), arrow func nhận đối sô là component
// nên khi gọi bên dưới truyền vô component App
// và khi chạy connector(App), thì hàm sẽ return component(Object.assign({}, props, selector(state), ...args))
// mà component đang là App ===> chạy hàm App({cars})
// const connector = connect() 

// chạy connect thì sẽ trả về props(cars)
// import the components into the App (Header,...)
// lấy vô todos để check xem có todo nào chưa, nếu chưa thì không hiện các phần UI như footer...
function App( {todos} ) {
    return toHtml`
        <section class="todoapp">
            ${Header()}
            ${todos.length > 0 && TodoList()}
            ${todos.length > 0 && Footer()}
        </section>
    `
}

export default connect()(App)