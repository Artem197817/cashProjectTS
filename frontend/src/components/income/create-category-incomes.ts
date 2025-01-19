import {HttpUtils} from "../../utils/http-utils";
import {CategoryResponse} from "../../types/category.type";

export class CreateCategoryIncomes {

   private url: string = '/categories/income'
   private mainTitle: string = "Создание категории доходов"
    readonly mainTitleElement: HTMLElement | null = null;
    readonly inputCategory: HTMLElement | null = null;
    readonly buttonCreate: HTMLElement | null = null;
    readonly buttonCancel: HTMLElement | null = null;



    constructor() {
        this.mainTitleElement = document.getElementById("main-title");
        if (this.mainTitleElement) {
            this.mainTitleElement.innerText = this.mainTitle;
        }
        this.inputCategory = document.getElementById("input-category");
        this.buttonCreate = document.getElementById("button-create");
        this.buttonCancel = document.getElementById("button-cancel");
       if (this.buttonCancel && this.buttonCreate){
           this.buttonCancel.setAttribute('href', '#/income')
           this.buttonCreate.addEventListener('click', this.createCategory.bind(this));
       }

    }

   private validateInput(): boolean {
        let isValid:boolean = true;
        if (this.inputCategory) {
            if ((this.inputCategory as HTMLInputElement).value.trim()) {
                this.inputCategory.classList.remove('is-invalid');
            } else {
                this.inputCategory.classList.add('is-invalid');
                isValid = false;
            }
        }
        return isValid;
    }

   private async createCategory(): Promise<void> {
        if (this.validateInput()) {
            const result: CategoryResponse = await HttpUtils.request(this.url, 'POST', true,
                {
                    title: (this.inputCategory as HTMLInputElement).value.trim()
                });
            if (result.error) {
                const inputErrorElement: HTMLElement | null  = document.getElementById('input-category-error');
                if(inputErrorElement)
                inputErrorElement.innerText = 'Что-то пошло не так ' + result.response.message;
                if(this.inputCategory)
                this.inputCategory.classList.add('is-invalid');
            } else {
                if(this.inputCategory)
                this.inputCategory.classList.remove('is-invalid');
                window.location.href = '#/income'
            }
        }
    }
}