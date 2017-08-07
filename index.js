class Form{
    constructor(formId, arrWithInputNames){
        this._inputs = arrWithInputNames.map(el => {
            const input = document.querySelector(`input[name="${el.name}"]`);
            input.onchange = el.customValidity;
            return {
                name: el.name,
                input: input
            };
        });

        this._form = document.querySelector(`form#${formId}`);
        this._form.addEventListener('submit', e => {
            e.preventDefault();
            this.submit(e);
        })
    }
    validate(){
        this._invalidInputs = this._inputs.filter(el => el.input.getAttribute('isValid') === 'false');
        return {
            isValid: !this._invalidInputs.length,
            errorFields: this._invalidInputs.map(el => el.name) || null
        }
    }
    setData(object){

    }
    submit(e){
        this._inputs.forEach(el => el.input.classList.remove('error'));
        if(!this.validate().isValid) {
            this._invalidInputs.forEach(el => el.input.classList.add('error'));
            return;
        }
        this._form
            .querySelector('#submitButton')
            .setAttribute('disabled', true);
    }
}

window.MyForm = new Form('myForm',[
    {
        name: 'fio',
        customValidity: e => {
            const value = e.target.value;
            const fullNameRegExp = /^([a-zа-яё-\s]+|\d+)$/i;
            e.target.setAttribute('isValid', fullNameRegExp.test(value) && value.split(' ').length === 3);
        }
    },
    {
        name: 'email',
        customValidity: e => {
            const value = e.target.value;
            const emailRegExp = /^([a-z0-9_\.-]+)@(yandex)+\.(ru|ua|by|kz|com)$/;
            const emailRegExpSecond = /^([a-z0-9_\.-]+)@(ya)+\.(ru)$/;
            e.target.setAttribute('isValid', emailRegExp.test(value) || emailRegExpSecond.test(value));
        }
    },
    {
        name: 'phone',
        customValidity: e => {
            const value = e.target.value;
            value.split('').filter(el => typeof +el === 'number');

            const phoneRegExp = /^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/;

            e.target.setAttribute('isValid', true);

        }
    }
]);

