import toHtml from "../core.js";
import TodoItem from "./TodoItem.js";
import { connect } from '../store.js'

const connector = connect()

// giá trị mặc định của state là 'bmw'
// hàm connector sẽ đc gán hàm return của connect(), arrow func nhận đối sô là component
// nên khi gọi bên dưới truyền vô component App
// và khi chạy connector(App), thì hàm sẽ return component(Object.assign({}, props, selector(state), ...args))
// mà component đang là App ===> chạy hàm App({cars})
// const connector = connect() 

// chạy connect thì sẽ trả về props(cars)
function TodoList({ todos, filter, filters }) {
    // object init from file reducer.js là  {}
    // mà init chứa todos
    // nênn destructuring để lấy ra todos list bằng cách {todos}
    
    return toHtml`
        <section class="main">
            <input 
                id="toggle-all" 
                class="toggle-all" 
                type="checkbox"
                onchange = "dispatch('toggleAll', this.checked)"
                ${todos.every(filters.completed) && 'checked'}
            >
            <label for="toggle-all">Mark all as complete</label>
            <ul class="todo-list">
                ${todos.filter(filters[filter]).map(function(todo, index) {    
                    return TodoItem( {todo, index} ); 
                }).join('')}
            </ul>
        </section>
    `
}

export default connector(TodoList)