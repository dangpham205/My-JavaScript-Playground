import toHtml from "../core.js";
import { connect } from '../store.js'


// giá trị mặc định của state là 'bmw'
// hàm connector sẽ đc gán hàm return của connect(), arrow func nhận đối sô là component
// nên khi gọi bên dưới truyền vô component App
// và khi chạy connector(App), thì hàm sẽ return component(Object.assign({}, props, selector(state), ...args))
// mà component đang là App ===> chạy hàm App({cars})
// const connector = connect() 

// chạy connect thì sẽ trả về props(cars)
function TodoItem( {todo, index, editIndex} ) {
    return toHtml`
        <li class="${todo.completed && 'completed'} ${editIndex === index && 'editing'}">
            <div class="view">
                <input 
                    class="toggle" 
                    type="checkbox" 
                    ${todo.completed && 'checked'}
                    onchange= "dispatch('toggle', ${index})"
                >
                <label ondblclick = "dispatch('startEditing', ${index})"> ${todo.title} </label>
                <button class="destroy" onclick="dispatch('delete', ${index})"></button>
            </div>
            <input 
                class="edit" 
                value="${todo.title}"
                onkeyup = "
                    event.key === 'Enter' && dispatch('edit', this.value.trim()) ||
                    event.key === 'Escape' && dispatch('cancelEditing')
                "
                onblur = "dispatch('edit', this.value.trim())"
            >
        </li>
    `
}

export default connect()(TodoItem) 