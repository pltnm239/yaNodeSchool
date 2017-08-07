class Form{
    constructor(arrWithInputNames){
        this._inputs = arrWithInputNames.map(el => {
            const input = document.querySelector(`input[name="${el.name}"]`);
            input.onchange = el.customValidity;
            return input;
        });

    }
    validate(){
        const invalidInputs = this._inputs.filter(el => el.getAttribute('isValid') === 'false');
        return {
            isValid: !invalidInputs.length,
            errorFields: invalidInputs.map(el => el.name) || null
        }
    }
    setData(object){

    }
    submit(){
        if(this.validate().isValid){

        }
    }
}

window.MyForm = new Form([
    {
        name: 'fio',
        customValidity: e => {
            e.target.setAttribute('isValid', true);
        }
    },
    {
        name: 'email',
        customValidity: e => {
            e.target.setAttribute('isValid', true);
        }
    },
    {
        name: 'phone',
        customValidity: e => {
            e.target.setAttribute('isValid', true);
        }
    }
]);