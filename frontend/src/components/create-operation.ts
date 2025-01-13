import {HttpUtils} from "../utils/http-utils";

export class CreateOperation {
    urlIncome = '/categories/income'
    urlCreate = '/operations'
    urlExpense = '/categories/expense'

    mainTitle = 'Создать доход/расход'


    constructor() {
        this.mainTitleElement = document.getElementById('main-title');
        this.mainTitleElement.innerText = this.mainTitle;
        this.categorySelectElement = document.getElementById('category-select');
        this.inputTypeSelectElement = document.getElementById('type');
        this.sumElement = document.getElementById('summa');
        this.dateElement = document.getElementById('date');
        this.commentElement = document.getElementById('comment');
        this.buttonCreate = document.getElementById('button-create');
        this.typeOperation = sessionStorage.getItem('type');
        this.buttonCreate.addEventListener('click', this.createOperation.bind(this));
        this.selectIncomeOption = document.getElementById('select-income');
        this.selectExpenseOption = document.getElementById('select-expense');
        if (this.typeOperation === 'income') {
            this.selectExpenseOption.removeAttribute('selected')
            this.selectIncomeOption.setAttribute('selected', 'selected');
        } else {
            this.selectIncomeOption.removeAttribute('selected')
            this.selectExpenseOption.setAttribute('selected', 'selected');
        }

        this.init().then();

    }


    async init() {
        this.categoryList = await this.getCategory();
        if (this.categoryList) {
            this.categoryList.forEach(category => {
                const optionElement = document.createElement('option');
                optionElement.setAttribute('value', category.id);
                optionElement.innerText = category.title;
                this.categorySelectElement.appendChild(optionElement);
            })
        }

    }

    async createOperation() {
        if (this.validateForm()) {
            const result = await HttpUtils.request(this.urlCreate, 'POST', true, {
                type: this.inputTypeSelectElement.value,
                amount: parseInt(this.sumElement.value),
                date: this.dateElement.value,
                comment: this.commentElement.value,
                category_id: parseInt(this.categorySelectElement.value)
            });
            window.location.href = '#/income-and-expenses'
        }
    }


    validateForm() {
        let isValid = true;

        if (this.inputTypeSelectElement.value.trim() === this.typeOperation) {
            this.inputTypeSelectElement.classList.remove('is-invalid');
        } else {
            this.inputTypeSelectElement.classList.add('is-invalid');
            isValid = false;
        }

        if (this.categorySelectElement.value.trim() !== 'Категория') {
            this.categorySelectElement.classList.remove('is-invalid');
        } else {
            this.categorySelectElement.classList.add('is-invalid');
            isValid = false;
        }

        if (this.sumElement.value.trim()) {
            this.sumElement.classList.remove('is-invalid');
        } else {
            this.sumElement.classList.add('is-invalid');
            isValid = false;
        }

        if (this.dateElement.value.trim()) {
            this.dateElement.classList.remove('is-invalid');
        } else {
            this.dateElement.classList.add('is-invalid');
            isValid = false;
        }
        if (this.commentElement.value.trim()) {
            this.commentElement.classList.remove('is-invalid');
        } else {
            this.commentElement.classList.add('is-invalid');
            isValid = false;
        }

        return isValid;
    }

    async getCategory() {
        let url = this.urlExpense;
        if (this.typeOperation === 'income') {
            url = this.urlIncome;
        }
        sessionStorage.removeItem('type');

        const result = await HttpUtils.request(url);

        if (result.error) {
            console.log(result.message)
            return [];
        }

        return result.response;
    }

}