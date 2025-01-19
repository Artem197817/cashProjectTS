import {LocalStorageUtil} from "../../utils/localStorageUtil";
import {HttpUtils} from "../../utils/http-utils";
import {Category} from "../../types/category.type";
import {SimpleResponseType} from "../../types/simple-response.type";

export class EditCategoryExpenses {

    private url: string = '/categories/expense';
    private mainTitle: string = "Редактирование категории расходов"
    readonly mainTitleElement: HTMLElement | null = null
    readonly buttonCreate: HTMLElement | null;
    readonly inputCategory: HTMLInputElement | null;
    readonly buttonCancel: HTMLElement | null;
    private editCategoryExpense: Category | null;

    constructor() {
        this.mainTitleElement = document.getElementById("main-title");
        if (this.mainTitleElement) {
            this.mainTitleElement.innerText = this.mainTitle;
        }
        this.inputCategory = document.getElementById("input-category") as HTMLInputElement;
        this.editCategoryExpense = LocalStorageUtil.getCategory();
        if (this.inputCategory && this.editCategoryExpense) {
            this.inputCategory.placeholder = this.editCategoryExpense.title;
        }
        this.buttonCreate = document.getElementById("button-create");
        if (this.buttonCreate) {
            this.buttonCreate.innerText = 'Редактировать'
            this.buttonCreate.addEventListener('click', this.editCategory.bind(this));
        }
        this.buttonCancel = document.getElementById("button-cancel");
        if (this.buttonCancel) {
            this.buttonCancel.setAttribute('href', '#/expenses')
        }
    }

    private validateInput(): boolean {
        let isValid: boolean = true;
        if (this.inputCategory)
            if (this.inputCategory.value.trim()) {
                this.inputCategory.classList.remove('is-invalid');
            } else {
                this.inputCategory.classList.add('is-invalid');
                isValid = false;
            }
        return isValid;
    }

    private async editCategory(): Promise<void> {
        if (this.validateInput() && this.inputCategory && this.editCategoryExpense) {

            const result: SimpleResponseType = await HttpUtils.request(this.url + '/' + this.editCategoryExpense.id
                , 'PUT', true,
                {
                    title: this.inputCategory.value.trim()
                });
            if (result.error) {
                const inputErrorElement: HTMLElement | null = document.getElementById('input-category-error');
                if (inputErrorElement)
                    inputErrorElement.innerText = 'Что-то пошло не так ' + result.message;
                this.inputCategory.classList.add('is-invalid');
            } else {
                this.inputCategory.classList.remove('is-invalid');
                window.location.href = '#/expenses'
            }
        }
    }
}