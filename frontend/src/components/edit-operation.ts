import {HttpUtils} from "../utils/http-utils";
import {LocalStorageUtil} from "../utils/localStorageUtil";

export class EditOperation {
    urlIncome = '/categories/income'
    urlCreate = '/operations'
    urlExpense = '/categories/expense'

    mainTitle = ' Редактировать доход/расход'


    constructor() {
        this.mainTitleElement = document.getElementById('main-title');
        this.mainTitleElement.innerText = this.mainTitle;
        this.editOperation = LocalStorageUtil.getOperation();
        this.categorySelectElement = document.getElementById('category-select');
        this.inputTypeSelectElement = document.getElementById('type');
        this.sumElement = document.getElementById('summa');
        this.dateElement = document.getElementById('date');
        this.commentElement = document.getElementById('comment');
        this.buttonCreate = document.getElementById('button-create');
        this.buttonCreate.innerText = 'Редактировать';
        this.selectCategoryTitle = document.getElementById('category-select-title');
        this.selectCategoryTitle.removeAttribute('selected')
        this.typeOperation = this.editOperation.type;
        this.buttonCreate.addEventListener('click', this.operationEdit.bind(this));
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
        if (this.categoryList && this.editOperation) {
            this.categoryList.forEach(category => {
                const optionElement = document.createElement('option');
                optionElement.setAttribute('value', category.id);
                optionElement.innerText = category.title;
                if (category.title === this.editOperation.category) {
                    optionElement.setAttribute('selected', 'selected');
                }
                this.categorySelectElement.appendChild(optionElement);
            })
            this.sumElement.value = this.editOperation.amount;
            this.dateElement.value = this.editOperation.date;
            this.commentElement.value = this.editOperation.comment;

        }

    }

    async operationEdit() {
        if (this.validateForm()) {
            const result = await HttpUtils.request(this.urlCreate + '/' + this.editOperation.id,
                'PUT', true, {
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