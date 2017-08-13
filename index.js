(function () {

    class Input {
        constructor({name, customValidity}) {
            this._name = name;
            this._el = document.querySelector(`input[name="${name}"]`);
            this._customeValidity = customValidity;
        }

        get name() {
            return this._name;
        }

        set value(value) {
            this._el.value = value;
        }

        get value() {
            return this._el.value;
        }

        validate() {
            const validStatus = this._customeValidity(this.value);
            this.setIsError(validStatus);
            return validStatus;
        }

        setIsError(status) {
            if (!status) {
                this._el.classList.add('error');
            } else {
                this._el.classList.remove('error');
            }
        }
    }

    const inputs = [
        {
            name: 'fio',
            customValidity: value => {
                const fullNameRegExp = /^([a-zа-яё]+\s+){2}[a-zа-яё]+$/i;
                return fullNameRegExp.test(value) && (value.split(' ').length === 3);
            }
        },
        {
            name: 'email',
            customValidity: value => {
                const emailRegExp = /^([a-z0-9_\.-]+)@(yandex\.ru|yandex\.ua|yandex\.by|yandex\.kz|yandex\.com|ya\.ru)$/;
                return emailRegExp.test(value);
            }
        },
        {
            name: 'phone',
            customValidity: value => {
                const phoneRegExp = /\+7\(\d{3}\)\d{3}-\d{2}-\d{2}/;
                const digitsSum = value
                    .split('')
                    .map(digit => +digit)
                    .filter(digit => !isNaN(digit))
                    .reduce((sum, digit) => sum + digit, 0);
                return (digitsSum <= 30) && phoneRegExp.test(value);
            }
        }
    ];

    window.MyForm = new function () {
        const form = document.querySelector(`form#myForm`),
            apiUrl = form.getAttribute('action'),
            submitButton = form.querySelector('button[type="submit"]'),
            resultContainer = document.querySelector('#resultContainer'),
            validateInputs = inputs.map(el => new Input(el));

        form.addEventListener('submit', e => {
            e.preventDefault();
            this.submit();
        });

        this.validate = () => {
            const invalidInputs = validateInputs.filter(el => !el.validate());
            return {
                isValid: !invalidInputs.length,
                errorFields: invalidInputs.map(el => el.name) || null
            }
        };

        this.getData = () => {
            const data = {};
            validateInputs.map(el => data[el.name] = el.value);
            return data;
        };

        this.setData = (data) => {
            validateInputs.forEach(el => {
                if (data[el.name]) {
                    el.value = data[el.name];
                }
            });
        };

        this.submit = () => {
            if (this.validate().isValid) {
                submitButton.innerText = 'Отправлено';
                submitButton.setAttribute('disabled', true);
                fetch(apiUrl)
                    .then(response => response.json())
                    .then(data => this._responseHandler(data));
            }
        };

        this._responseHandler = (data) => {
            resultContainer.classList.add(data.status);
            if (data.status === 'success') {
                resultContainer.innerHTML = '<p>Вы приняты!</p>';
            }
            if (data.status === 'error') {
                resultContainer.innerHTML = `<p>${data.reason}</p>`;
            }
            if (data.status === 'progress') {
                setTimeout(() => this.submit(), data.timeout);
                resultContainer.innerHTML = '<p>Пожалуйста, подождите...</p>';
            }
        }
    };

}());

