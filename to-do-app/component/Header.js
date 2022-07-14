import toHtml from "../core.js";


// giá trị mặc định của state là 'bmw'
// hàm connector sẽ đc gán hàm return của connect(), arrow func nhận đối sô là component
// nên khi gọi bên dưới truyền vô component App
// và khi chạy connector(App), thì hàm sẽ return component(Object.assign({}, props, selector(state), ...args))
// mà component đang là App ===> chạy hàm App({cars})
// const connector = connect() 

// chạy connect thì sẽ trả về props(cars)
function Header() {
    return toHtml`
        <header class="header">
            <h1>todos</h1>
            <input 
                class="new-todo" 
                placeholder="What needs to be done?" 
                autofocus
                onkeyup = "event.key === 'Enter' && dispatch('add', this.value.trim())"
            >
        </header>
    `
}

export default Header