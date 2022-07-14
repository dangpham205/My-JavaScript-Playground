
var courseApi = 'http://localhost:3000/courses'

function start() {
    getCourses(function(courses){
        renderCourses(courses)
    })
    handleCreateForm()
}

start()


// functions

function getCourses(callback) {
    fetch(courseApi)
        .then(function(response) {
            return response.json()
        })
        .then(callback)
}

function renderCourses(courses) {
    var courseList = document.querySelector('.course-list')
    var html = courses.map(function(course) {
        return `<li class = "course-item-${course.id} ">
                    <h4> ${course.name} </h4>
                    <p> ${course.author} </p>
                    <button onclick= "deleteCourse(${course.id})" >Delete</button>
                </li>`
    })

    courseList.innerHTML = html.join('')
}

function createCourse(course, callback) {
    var options =  {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(course)
    }
    fetch(courseApi,options)
        .then(function(response){
            response.json()
        })
        .then(callback)
    }
    
function deleteCourse(id){
    var options =  {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
    }
    fetch(courseApi + "/" + id,options)
        .then(function(response){
            response.json()
        })
        .then(function(){
            var deleteItem = document.querySelector(`.course-item-${id}`)
            if (deleteItem){
                deleteItem.remove()
            }
        })    
}


function handleCreateForm() {
    var createBtn = document.querySelector('#create')
    createBtn.onclick = function() {
        var name = document.querySelector('input[name = "name"]').value
        var author = document.querySelector('input[name = "author"]').value
        var course = {
            name: name,
            author: author
        }
        createCourse(course, function(){
            getCourses(function(courses){
                renderCourses(courses)
            })
        })
    }
}