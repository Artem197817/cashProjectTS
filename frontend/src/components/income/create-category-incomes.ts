import {HttpUtils} from "../../utils/http-utils";

export class CreateCategoryIncomes {

    url = '/categories/income'
    mainTitle = "Создание категории доходов"

    constructor() {
        this.mainTitleElement = document.getElementById("main-title");
        this.mainTitleElement.innerText = this.mainTitle;
        this.inputCategory = document.getElementById("input-category");
        this.buttonCreate = document.getElementById("button-create");
        this.buttonCancel = document.getElementById("button-cancel");
        this.buttonCancel.setAttribute('href', '#/income')
        this.buttonCreate.addEventListener('click', this.createCategory.bind(this));

    }

    validateInput() {
        let isValid = true;

        if (this.inputCategory.value.trim()) {
            this.inputCategory.classList.remove('is-invalid');
        } else {
            this.inputCategory.classList.add('is-invalid');
            isValid = false;
        }
        return isValid;
    }

    async createCategory() {
        if (this.validateInput()) {
            const result = await HttpUtils.request(this.url, 'POST', true,
                {
                    title: this.inputCategory.value.trim()
                });
            if (result.error || !result.response) {
                const inputErrorElement = document.getElementById('input-category-error');
                inputErrorElement.innerText = 'Что-то пошло не так ' + result.message;
                this.inputCategory.classList.add('is-invalid');
            } else {
                this.inputCategory.classList.remove('is-invalid');
                window.location.href = '#/income'
            }
        }
    }
}