import {HttpUtils} from "../../utils/http-utils";
import {LocalStorageUtil} from "../../utils/localStorageUtil";
import {Operation} from "../../types/operations.type";
import {Category, CategoryResponse} from "../../types/category.type";


export class EditOperation {
    private urlIncome: string = '/categories/income'
    private urlCreate: string = '/operations'
    private urlExpense: string = '/categories/expense'
    readonly typeOperation: string = '';
    private categoryList: Category[] = [];
    private mainTitle: string = ' Редактировать доход/расход'
    readonly mainTitleElement: HTMLElement | null = null;
    readonly categorySelectElement: HTMLElement | null = null;
    readonly inputTypeSelectElement: HTMLElement | null = null;
    readonly sumElement: HTMLInputElement | null = null;
    readonly dateElement: HTMLElement | null = null;
    readonly commentElement: HTMLElement | null = null;
    readonly buttonCreate: HTMLElement | null = null;
    readonly selectCategoryTitle: HTMLElement | null = null;
    readonly selectIncomeOption: HTMLElement | null = null;
    readonly selectExpenseOption: HTMLElement | null = null;
    readonly editOperation: Operation | null;

    constructor() {
        this.mainTitleElement = document.getElementById('main-title');
        if (this.mainTitleElement) {
            this.mainTitleElement.innerText = this.mainTitle;
        }
        this.editOperation = LocalStorageUtil.getOperation();
        this.categorySelectElement = document.getElementById('category-select');
        this.inputTypeSelectElement = document.getElementById('type');
        this.sumElement = document.getElementById('summa') as HTMLInputElement;
        this.dateElement = document.getElementById('date');
        this.commentElement = document.getElementById('comment');
        this.buttonCreate = document.getElementById('button-create');
        this.selectCategoryTitle = document.getElementById('category-select-title');
        if (this.selectCategoryTitle) {
            this.selectCategoryTitle.removeAttribute('selected')
        }
        if(this.editOperation){
            this.typeOperation = this.editOperation.type;
        }
        if (this.buttonCreate) {
            this.buttonCreate.innerText = 'Редактировать';
            this.buttonCreate.addEventListener('click', this.operationEdit.bind(this));
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
        if (this.categoryList && this.editOperation) {
            this.categoryList.forEach(category => {
                const optionElement: HTMLElement = document.createElement('option');
                optionElement.setAttribute('value', category.id.toString());
                optionElement.innerText = category.title;
                if (this.editOperation && category.title === this.editOperation.category) {
                    optionElement.setAttribute('selected', 'selected');
                }
                if (this.categorySelectElement) {
                    this.categorySelectElement.appendChild(optionElement);
                }
            })
            if (this.sumElement && this.dateElement && this.commentElement && this.editOperation) {
                this.sumElement.value = this.editOperation.amount.toString();
                (this.dateElement as HTMLInputElement).value = this.editOperation.date;
                (this.commentElement as HTMLInputElement).value = this.editOperation.comment;
            }


        }

    }

    async operationEdit() {
        if (this.validateForm() && this.editOperation) {
            await HttpUtils.request(this.urlCreate + '/' + this.editOperation.id,
                'PUT', true, {
                    type: (this.inputTypeSelectElement as HTMLInputElement).value,
                    amount: parseInt((this.sumElement as HTMLInputElement).value),
                    date: (this.dateElement as HTMLInputElement).value,
                    comment: (this.commentElement as HTMLInputElement).value,
                    category_id: parseInt((this.categorySelectElement as HTMLInputElement).value)
                });
            window.location.href = '#/income-and-expenses'
        }
    }

    private validateForm(): boolean {
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