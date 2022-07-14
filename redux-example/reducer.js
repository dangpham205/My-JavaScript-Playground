const init = {
    cars: ['BMW']
}

export default function reducer(state = init, action, args) {

    // khi dispatch() thì sẽ lọt vào đây
    console.log(action, args)
    switch(action){
        case 'ADD':
            const [newCar] = args
            return {
                ...state,
                cars: [...state.cars, newCar]
            }
        default: 
            // lần đầu chạy hàm reducer() bên core.js thì sẽ trả về cái này
            // do chạy không truyền tham số nên sẽ trả về state, mặc định là init
            return state
    }

}