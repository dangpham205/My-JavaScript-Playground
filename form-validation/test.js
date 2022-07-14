var a = 'a'
fname = a

const p  = {
    fname: 'b',
    getna() {
        return `${this.fname}`
    }
}
console.log(p.getna())  //b

const getpname = p.getna
console.log(getpname())

// this.firstName ="Thi"
// this.lastName = "Thu"
firstName ="Thi"
lastName = "Thu"

// const teacher = {
//     firstName: "Minh",
//     lastName: "Thao",
//     getFullName(){
//         return `${this.firstName} ${this.lastName}`
//     }
// }

// console.log( teacher.getFullName()) // "Minh Thào"

// const getTeacherName = teacher.getFullName
// console.log(getTeacherName()) // "Minh Thu"