
function Validator(options) {

    // element: thằng con (input), select: thằng cha muốn tìm
    function getParent(element, selector) {
        while (element.parentElement) {
            if (element.parentElement.matches(selector)) {
                return element.parentElement
            }
            element = element.parentElement
        }
    }

    var selectorRules = {}

    function validate(inputElement, rule) {
        var errorMessageElement = getParent(inputElement, options.formGroup).querySelector(options.errorSelector)
        var errorMessage 
        
        // lấy ra các rules của selector
        var rules = selectorRules[rule.selector]
        
        // nếu rule nào có lỗi thì dừng kiểm tra
        for (var i = 0; i < rules.length; ++i){
            switch (inputElement.type) {
                case 'checkbox':
                case 'radio':
                    errorMessage = rules[i](
                        formElement.querySelector(rule.selector + ':checked')
                    )
                    break
                default:
                    errorMessage = rules[i](inputElement.value)
            }
            if (errorMessage){
                break
            }
        }

        if (errorMessage) {
            errorMessageElement.innerText = errorMessage
            getParent(inputElement, options.formGroup).classList.add('invalid')
        }
        else {
            errorMessageElement.innerText = ""
            getParent(inputElement, options.formGroup).classList.remove('invalid')
        }

        return !errorMessage       //trả về true nếu có lỗi và ngược lại
    }

    var formElement = document.querySelector(options.form)
    if (formElement) {
        formElement.onsubmit = function(e) {
            e.preventDefault()

            var isValidAll = true

            // check hết tất cả các field khi submit
            options.rules.forEach(function(rule) {
                var inputElement = formElement.querySelector(rule.selector)
                var isValid = validate(inputElement, rule)
                if( !isValid ){
                    isValidAll = false   
                }
            })

            if (isValidAll){
                // TH có truyền vô hàm onSubmit
                if (typeof options.onSubmit === 'function'){
                    
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
                    
                    options.onSubmit(formValues)
                }
                // TH không truyền vô hàm onSubmit ====> không preventDefault() nữa
                else {
                    formElement.submit()
                }
            }
            else{

            }
        }


        options.rules.forEach(function(rule) {
            // lưu lại các rules cho mỗi input
            if (Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test)
            }
            else {
                selectorRules[rule.selector] = [rule.test]
            }

            var inputElements = formElement.querySelectorAll(rule.selector)

            Array.from(inputElements).forEach(function(inputElement) {
                inputElement.onblur = function() {
                    validate(inputElement, rule)
                }
    
                inputElement.oninput = function() {
                    var errorMessageElement = getParent(inputElement, options.formGroup).querySelector(options.errorSelector)
                    errorMessageElement.innerText = ""
                    getParent(inputElement, options.formGroup).classList.remove('invalid')
                }
            })

        })
    }
}

// define rules
// nguyên tắc của các rules
// 1. khi có lỗi => trả message lỗi
// 2. khi hợp lệ => không trả về gì (undefined)
Validator.isRequired = function(selector) {
    return {
        selector: selector,
        test: function(value) {
            return value ? undefined : 'Vui lòng điền thông tin vào trường này.'
        }
    }
}

Validator.isEmail = function(selector) {
    return {
        selector: selector,
        test: function(value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
            return regex.test(value) ? undefined : 'Vui lòng nhập email.'
        }
    }
}

Validator.minLength = function(selector, minLength) {
    return {
        selector: selector,
        test: function(value) {
            return value.length >= minLength ? undefined : `Vui lòng nhập tối thiểu ${minLength} kí tự.`
        }
    }
}

Validator.isConfirmed = function(selector, getConfirmValue, errorMessage) {
    return {
        selector: selector,
        test: function(value) {
            return value === getConfirmValue() ? undefined : errorMessage || `Vui lòng nhập lại thông tin.`
        }
    }
}