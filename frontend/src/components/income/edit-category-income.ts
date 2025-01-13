import {LocalStorageUtil} from "../../utils/localStorageUtil";
import {HttpUtils} from "../../utils/http-utils";

export class EditCategoryIncomes {

    url = '/categories/income';

    mainTitle = "Редактирование категории доходов"

    constructor() {
        this.mainTitleElement = document.getElementById("main-title");
        this.mainTitleElement.innerText = this.mainTitle;
        this.inputCategory = document.getElementById("input-category");
        this.editCategoryIncome = LocalStorageUtil.getCategory();
        this.inputCategory.placeholder = this.editCategoryIncome.title;
        this.buttonCreate = document.getElementById("button-create");
        this.buttonCreate.innerText = 'Редактировать'
        this.buttonCancel = document.getElementById("button-cancel");
        this.buttonCancel.setAttribute('href', '#/income')
        this.buttonCreate.addEventListener('click', this.editCategory.bind(this));

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

    async editCategory() {
        if (this.validateInput()) {


            const result = await HttpUtils.request(this.url + '/' + this.editCategoryIncome.id
                , 'PUT', true,
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