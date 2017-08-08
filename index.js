class Form{
    constructor(formId, resultContainerId, arrWithInputNames){
        this._form = document.querySelector(`form#${formId}`);
        this._form.addEventListener('submit', e => {
            e.preventDefault();
            this.submit();
        });
        this._inputs = arrWithInputNames.map(el => {
            const input = this._form.querySelector(`input[name="${el.name}"]`);
            input.onchange = el.customValidity;
            return {
                name: el.name,
                input: input
            };
        });
        this._apiUrl = this._form.getAttribute('action');
        this._submitButton = this._form.querySelector('button[type="submit"]');
        this._resultContainer = document.querySelector(`#${resultContainerId}`);
    }
    validate(){
        this._invalidInputs = this._inputs.filter(el => el.input.getAttribute('data-valid') === 'false');
        return {
            isValid: !this._invalidInputs.length,
            errorFields: this._invalidInputs.map(el => el.name) || null
        }
    }
    getData(){
        let data = {};
        this._inputs.forEach(el => data[el.name] = el.input.value);
        return data;
    }
    setData(data){
        this._inputs.forEach(el => {
            if(data[el.name]) el.input.value = data[el.name];
        });
    }
    submit(){
        this._inputs.forEach(el => el.input.classList.remove('error'));
        if(!this.validate().isValid) {
            this._invalidInputs.forEach(el => el.input.classList.add('error'));
        }else {
            this._submitButton.innerText = 'Отправлено';
            this._submitButton.setAttribute('disabled', true);
            fetch(this._apiUrl)
                .then(response => response.json())
                .then(data => this._responseHandler(data));
        }
    }
    _responseHandler(data){
        this._resultContainer.classList.add(data.status);
        if(data.status === 'success'){
            this._resultContainer.innerHTML = 'Вы приняты!';
        }
        if(data.status === 'error'){
            this._resultContainer.innerHTML = `<p>${data.reason}</p>`;
        }
        if(data.status === 'progress'){
            setTimeout(() => this.submit(), data.timeout);
            this._resultContainer.innerHTML = 'Пожалуйста, подождите...';
        }
    }
}
window.MyForm = new Form('myForm', 'resultContainer', [
    {
        name: 'fio',
        customValidity: e => {
            const value = e.target.value;
            const fullNameRegExp = /^([a-zа-яё-\s]+|\d+)$/i;
            e.target.setAttribute('data-valid', fullNameRegExp.test(value) && value.split(' ').length === 3);
        }
    },
    {
        name: 'email',
        customValidity: e => {
            const value = e.target.value;
            const emailRegExp = /^([a-z0-9_\.-]+)@(yandex)+\.(ru|ua|by|kz|com)$/;
            const emailRegExpSecond = /^([a-z0-9_\.-]+)@(ya)+\.(ru)$/;
            e.target.setAttribute('data-valid', emailRegExp.test(value) || emailRegExpSecond.test(value));
        }
    },
    {
        name: 'phone',
        customValidity: e => {
            const value = e.target.value;
            const phoneRegExp = /\+7\(\d{3}\)\d{3}-\d{2}-\d{2}/;
            let phoneNumbersSum = 0;
            value.split('')
                .filter(el => el.match(/\d/))
                .forEach(el => phoneNumbersSum += +el);
            e.target.setAttribute('data-valid', phoneNumbersSum <= 30 && phoneRegExp.test(value));
        }
    }
]);
