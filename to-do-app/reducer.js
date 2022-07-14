// khi dispatch action sẽ đẩy sang file này

import storage from "./util/storage.js"

const init = {
    // todos: [
    //     {
    //         title: 'Work out',
    //         completed: false,
    //     },
    //     {
    //         title: 'Read Book',
    //         completed: true,
    //     },
    // ]
    todos: storage.get(),
    filter: 'all',
    filters: {
        all: () => true,
        active: todo => !todo.completed,
        completed: todo => todo.completed
    },
    editIndex: null
}

const actions = {
    add({todos}, title) {
        if (title) {
            todos.push( {title, completed: false} );
            storage.set(todos)
        }
    },
    delete({todos}, index) {
        todos.splice(index, 1);
        storage.set(todos)
    },
    deleteMultiple(state) {
        state.todos = state.todos.filter(state.filters.active)
        storage.set(state.todos)
    },
    toggle( {todos}, index) {
        const todo = todos[index];
        todo.completed = !todo.completed;
        storage.set(todos)
    },
    toggleAll( {todos}, isChecked) {
        todos.forEach(function(todo) {
            return todo.completed = isChecked
        })
        storage.set(todos)
    },
    switchFilter(state, newFilter) {
        state.filter = newFilter
    },
    startEditing(state, index) {
        state.editIndex = index
    },
    edit(state, newTitle) {
        if (state.editIndex !== null) {
            if (newTitle) {
                state.todos[state.editIndex].title = newTitle
                state.editIndex = null
                storage.set(state.todos)
            }
        }
    },
    cancelEditing(state) {
        state.editIndex = null
    }
}

// first time initialization will return init so we assign state = init
// logic of this function: depending on the action, we will do the logic to change the state (the data of the app), then return the new state
export default function reducer(state = init, action, args) {
    actions[action] && actions[action](state, ...args);
    return state;


    // switch (action) {
    //     case 'ADD':
    //         if (title.length != '') {
    //             const [title] = args
    //             storage.set([...state.todos, { title , completed: false }])
    //             // return state mới (init mới)
    //             return {
    //                 // return ...state ở đằng trước để lấy các key value còn lại trong init (nếu có)
    //                 // trường hợp ở đây init chỉ có mỗi todos nên nếu bỏ ...state thì vẫn chạy được
    //                 // nếu có ...state ở đây thì phải để trc vì state này là previous state nên có chứa todos
    //                 // nên nếu để trước thì todos kia sẽ định nghĩa lại todos nằm trong state
    //                 ...state,
    //                 todos: [...state.todos, { title , completed: false }],
    //             }
    //         }
    //     default: 
    //         return state
    // }

    
}