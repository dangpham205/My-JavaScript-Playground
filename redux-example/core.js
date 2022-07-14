export default function toHtml([first, ...strings], ...values) {
    return values.reduce(function(accum, curr) {
        return accum.concat(curr, strings.shift())
    }, [first])
    .filter(function(x) {
        // loại bỏ hết tất cả giá trị falsy ở thẻ heading
        return x && x !== true || x===0     
    })
    .join('')
}


// reducer ở đây là của redux chứ kp hàm reduce, mô tả một hành động (onclick, onblur...)
export function createStore(reducer){
    // data trong storage gọi là state
    let state = reducer()
    // chứa các elements để render ra view
    // Map gần giống obj , nhưng cho phép đặt tên key tùy ý (số 0,1,2....)
    const roots = new Map()

    // lặp qua roots để render ra view
    function render() { 
        for (const [root, component] of roots) {
            // component là 1 đối tượng html đc render ra view
            const output = component()
            root.innerHTML = output
        }
    }

    return {
        attach: function(component, root) {
            roots.set(root, component)
            render()
        },
        // connect() đẩy dữ liệu từ store vào view
        connect(selector = state => state) {
            // arrow function có đối số là component , và nó trả về 1 arrow func
            // props là những dữ liệu muốn truyền vào component sau này
            return component => (props, ...args) =>
                //return hàm component với 3 tham số, vì cả 3 có thể sẽ là những object
                // nên merge chúng lại bằng hàm Object.assign(), {} tham số đầu là tạo 1 object rỗng
                component(Object.assign({}, props, selector(state), ...args))
        },
        // ...args là tất cả những dữ liệu muốn gửi đi cho thằng action, vd xóa thì gửi thêm id thằng cần xóa, thêm thì gửi thông tin thằng cần add
        dispatch(action, ...args) {
            // reducer của redux cũng có tính chất như .reduce() của mảng, nó sẽ nhận biến tích trữ mỗi lần lặp
            // mà lần trước reducer() đc gọi là ở dòng 16, nên ở đây khi gọi thì phải truyền biến state vô vì nó là biến tích trữ từ
            // lần trc
            // mỗi khi mà dispatch thì sẽ dựa vào action để sửa state và return state mới  => storage đc update lại 
            // và sau khi storage update thì cần render lại ra view bằng hàm render()
            // mỗi khi chạy sẽ gọi reducer, với state là từ lần trc đó, vd lần đầu chạy sẽ là 'bmw'
            state = reducer(state, action, args)
            render()
        }
    }
}