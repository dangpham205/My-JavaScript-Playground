import toHtml from "../core.js";
import {connect} from "../store.js";


// giá trị mặc định của state là 'bmw'
// hàm connector sẽ đc gán hàm return của connect(), arrow func nhận đối sô là component
// nên khi gọi bên dưới truyền vô component App
// và khi chạy connector(App), thì hàm sẽ return component(Object.assign({}, props, selector(state), ...args))
// mà component đang là App ===> chạy hàm App({cars})
// const connector = connect() 

// chạy connect thì sẽ trả về props(cars)
function Footer( {todos, filter, filters} ) {
    return toHtml`
        <footer class="footer">
            <span class="todo-count">
                <strong>${todos.filter(filters.active).length}</strong> item left
            </span>
            <ul class="filters">
                ${Object.keys(filters).map(type => toHtml`
                    <li>
                        <a class="${filter === type && 'selected'}" href="#" onclick = "dispatch('switchFilter', '${type}')"> 
                            ${type[0].toUpperCase() + type.slice(1)}
                        </a>
                    </li>
                `)}                
            </ul>
            ${todos.filter(filters.completed).length > 0 && toHtml`
                <button class="clear-completed" onclick = "dispatch('deleteMultiple')">Clear completed</button>
            `}
        </footer>
    `
}

export default connect()(Footer)