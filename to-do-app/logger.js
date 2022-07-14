export default function withLogger(reducer) {
    
    // vì reducer là 1 hàm nên hàm này phải trả về 1 hàm
    return (prevState, action, args) => {
        console.group(action);
        console.log('Prev State', prevState)
        console.log('Action Arguments', args)

        const nextState = reducer(prevState, action, args)
        
        console.log('Next State', nextState)
        console.groupEnd()

        return nextState
    }
}