function Validator2(formSelector) {

    var formRules = {}
    var formElement = document.querySelector(formSelector)
    var validateRules = {
        required: function(value) {
            return value ? undefined : 'Vui lòng điền thông tin vào trường này.'
        },
        email: function(value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
            return regex.test(value) ? undefined : 'Vui lòng nhập email hợp lệ.'
        },
        min: function(min) {
            return function(value) {
                return value.length >= min ? undefined : `Vui lòng nhập ít nhất ${min} kí tự.`
            }
        },
        max: function(max) {
            return function(value) {
                return value.length <= max ? undefined : `Vui lòng nhập nhiều nhất ${min} kí tự.`
            }
        },
    }

    if (formElement) {
        
        var inputElements = formElement.querySelectorAll('[name][rules]')
        
        for (var inputElement of inputElements) {
            var rules = inputElement.getAttribute('rules').split('|')
            for (var rule of rules) {

                var parameterRule
                var isParameterRule = rule.includes(':') 

                if (isParameterRule){
                    parameterRule = rule.split(':')
                    rule = parameterRule[0]
                }

                var ruleFunc = validateRules[rule]
                if (isParameterRule) {
                    // trong trường hợp là hàm có đối số như min() max() thì các hàm đó sẽ trả về 1 function được chạy với đối số min,max
                    // thì phải replace func bằng nó khi run với đối số sau dấu ':'
                    // ==> function(parameterRule[1], vd:6) ====> return function(value) {
                        // return value.length <= max ? undefined : `Vui lòng nhập nhiều nhất ${min} kí tự.`
                    // }
                    ruleFunc = ruleFunc(parameterRule[1])
                }

                if (Array.isArray(formRules[inputElement.name])) {
                    formRules[inputElement.name].push(ruleFunc)
                }
                else {
                    // lần đầu mà gán rule cho 1 field thì sẽ gán theo kiểu này, còn từ lần 2 thì sẽ push vô mảng như if ở trên
                    formRules[inputElement.name] = [ruleFunc]     
                }
            }


            // validate
            inputElement.onblur = handleValidate
            inputElement.oninput = handleClearErrorMessage
        }

        function handleValidate(e) {
            var rules = formRules[e.target.name]
            var errorMessage 

            for (var rule of rules) {
                errorMessage = rule(e.target.value)
                if (errorMessage) break
            }

            // nếu có lỗi thì hiển thị ra UI
            if (errorMessage) {
                var formGroupElement = getParent(e.target, '.form-group')
                if (formGroupElement) {
                    formGroupElement.classList.add('invalid')

                    var errorMessageElement = formGroupElement.querySelector('.form-message')
                    if (errorMessageElement) {
                        errorMessageElement.innerText = errorMessage
                    } 
                }
            }

            return !errorMessage
        }
        
        // clear message lỗi mỗi khi typing
        function handleClearErrorMessage(e) {
            var formGroupElement = getParent(e.target, '.form-group')
            if (formGroupElement.classList.contains('invalid')){
                formGroupElement.classList.remove('invalid')
        
                var errorMessageElement = formGroupElement.querySelector('.form-message')
                if (errorMessageElement) {
                    errorMessageElement.innerText = ''
                } 

            }
        }
    }

    // xử lí khi submit form
    var _this = this

    formElement.onsubmit = function(e) {
        e.preventDefault()
        
        var inputElements = formElement.querySelectorAll('[name][rules]')
        var isValidAll = true
        
        for (var inputElement of inputElements) {
            if (!handleValidate({target: inputElement})) {
                isValidAll = false
            }
        }

        if (isValidAll) {
            if (typeof _this.onSubmit === 'function') {
                // lấy ra tất cả các field input có attr 'name' mà được enable(điền thông tin): input, checkbox....
                var enableInputs = formElement.querySelectorAll('[name]:not([disabled])')
                    
                var formValues = Array.from(enableInputs).reduce(function(values, formInput) {

                    switch(formInput.type) {
                        case 'radio':
                            values[formInput.name] = formElement.querySelector('input[name="' +formInput.name+ '"]:checked').value
                            break
                        case 'checkbox':
                            if (!formInput.matches(':checked')) {
                                values[formInput.name] = ''
                                return values
                            }
                            if (!Array.isArray(values[formInput.name])) {
                                values[formInput.name] = []
                            }
                            values[formInput.name].push(formInput.value)
                            break
                        case 'file':
                            values[formInput.name] = formInput.files
                            break
                        default:
                            values[formInput.name] = formInput.value
                    }
                    return values
                }, {})

                _this.onSubmit(formValues)
            }
            else {
                formElement.submit()
            }
        }
    }

    function getParent(element, selector) {
        while (element.parentElement) {
            if (element.parentElement.matches(selector)) {
                return element.parentElement
            }
            element = element.parentElement
        }
    }
}