import {HttpUtils} from "../../utils/http-utils";
import {Category, CategoryResponse} from "../../types/category.type";

export class CreateOperation {
    private urlIncome: string = '/categories/income'
    private urlCreate: string = '/operations'
    private urlExpense: string = '/categories/expense'

    private mainTitle: string = 'Создать доход/расход'
    readonly typeOperation: string | null = null;
    readonly mainTitleElement: HTMLElement | null = null;
    readonly categorySelectElement: HTMLElement | null = null;
    readonly inputTypeSelectElement: HTMLElement | null = null;
    readonly sumElement: HTMLElement | null = null;
    readonly commentElement: HTMLElement | null = null;
    readonly dateElement: HTMLElement | null = null;
    readonly buttonCreate: HTMLElement | null = null;
    readonly selectIncomeOption: HTMLElement | null = null;
    readonly selectExpenseOption: HTMLElement | null = null;
    private categoryList: Category[] = [];

    constructor() {
        this.mainTitleElement = document.getElementById('main-title');
        if (this.mainTitleElement) {
            this.mainTitleElement.innerText = this.mainTitle;
        }
        this.categorySelectElement = document.getElementById('category-select');
        this.inputTypeSelectElement = document.getElementById('type');
        this.sumElement = document.getElementById('summa');
        this.dateElement = document.getElementById('date');
        this.commentElement = document.getElementById('comment');
        this.buttonCreate = document.getElementById('button-create');
        this.typeOperation = sessionStorage.getItem('type');
        if (this.buttonCreate) {
            this.buttonCreate.addEventListener('click', this.createOperation.bind(this));
        }
        this.selectIncomeOption = document.getElementById('select-income');
        this.selectExpenseOption = document.getElementById('select-expense');
        if (this.selectExpenseOption && this.selectIncomeOption) {
            if (this.typeOperation === 'income') {
                this.selectExpenseOption.removeAttribute('selected')
                this.selectIncomeOption.setAttribute('selected', 'selected');
            } else {
                this.selectIncomeOption.removeAttribute('selected')
                this.selectExpenseOption.setAttribute('selected', 'selected');
            }
        }

        this.init().then();

    }


    private async init(): Promise<void> {
        this.categoryList = await this.getCategory();
        if (this.categoryList) {
            this.categoryList.forEach(category => {
                const optionElement: HTMLElement = document.createElement('option');
                optionElement.setAttribute('value', category.id.toString());
                optionElement.innerText = category.title;
                if (this.categorySelectElement)
                    this.categorySelectElement.appendChild(optionElement);
            })
        }

    }

    private async createOperation(): Promise<void> {
        if (this.validateForm()) {
             await HttpUtils.request(this.urlCreate, 'POST', true, {
                type: (this.inputTypeSelectElement as HTMLInputElement).value,
                amount: parseInt((this.sumElement as HTMLInputElement).value),
                date: (this.dateElement as HTMLInputElement).value,
                comment: (this.commentElement as HTMLInputElement).value,
                category_id: parseInt((this.categorySelectElement as HTMLInputElement).value)
            });
            window.location.href = '#/income-and-expenses'
        }
    }


    validateForm() {
        let isValid: boolean = true;

        if ((this.inputTypeSelectElement as HTMLInputElement).value.trim() === this.typeOperation) {
            if (this.inputTypeSelectElement)
                this.inputTypeSelectElement.classList.remove('is-invalid');
        } else {
            if (this.inputTypeSelectElement)
                this.inputTypeSelectElement.classList.add('is-invalid');
            isValid = false;
        }

        if ((this.categorySelectElement as HTMLInputElement).value.trim() !== 'Категория') {
            if (this.categorySelectElement)
                this.categorySelectElement.classList.remove('is-invalid');
        } else {
            if (this.categorySelectElement)
                this.categorySelectElement.classList.add('is-invalid');
            isValid = false;
        }

        if ((this.sumElement as HTMLInputElement).value.trim()) {
            if (this.sumElement)
                this.sumElement.classList.remove('is-invalid');
        } else {
            if (this.sumElement)
                this.sumElement.classList.add('is-invalid');
            isValid = false;
        }

        if ((this.dateElement as HTMLInputElement).value.trim()) {
            if (this.dateElement)
                this.dateElement.classList.remove('is-invalid');
        } else {
            if (this.dateElement)
                this.dateElement.classList.add('is-invalid');
            isValid = false;
        }
        if ((this.commentElement as HTMLInputElement).value.trim()) {
            if (this.commentElement)
                this.commentElement.classList.remove('is-invalid');
        } else {
            if (this.commentElement)
                this.commentElement.classList.add('is-invalid');
            isValid = false;
        }

        return isValid;
    }

   private async getCategory(): Promise<Category[]> {
        let url: string = this.urlExpense;
        if (this.typeOperation === 'income') {
            url = this.urlIncome;
        }
        sessionStorage.removeItem('type');

        const result: CategoryResponse = await HttpUtils.request(url);

        if (result.error) {
            console.log(result.response.message)
            return [];
        }

        return result.response;
    }

}