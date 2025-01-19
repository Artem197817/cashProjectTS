import {CardCreate} from "../../utils/card-create";
import {LocalStorageUtil} from "../../utils/localStorageUtil";
import {HttpUtils} from "../../utils/http-utils";
import {CategoriesArray, Category, CategoryResponse} from "../../types/category.type";
import {OperationsArray, OperationsResponse} from "../../types/operations.type";
import {SimpleResponseType} from "../../types/simple-response.type";


export class Income {
    private url:string = '/categories/income';
   private urlOperations:string = '/operations'
   private mainTitle:string = 'Доходы'
    readonly mainTitleElement: HTMLElement | null = null;
    readonly cardsElement: HTMLElement | null = null;
    readonly cardAdd: HTMLElement | null = null;
    readonly allertElement: HTMLElement | null = null;
    readonly buttonAlertYes: HTMLElement | null = null;
    readonly buttonAlertNo: HTMLElement | null = null;
    private addIncomeElement: HTMLElement | null = null;
    readonly layoutCategoryButton: HTMLElement | null = null;
    readonly layoutIncomeButton: HTMLElement | null = null;
    private incomes: CategoriesArray = [];



    constructor() {
        this.mainTitleElement = document.getElementById('main-title');
        this.cardsElement = document.getElementById('cards');
        this.cardAdd = document.createElement('div');
        this.cardAdd.classList.add('card');
        this.cardAdd.setAttribute('id', 'add');
        this.allertElement = document.getElementById('alert-popup-block');
        this.buttonAlertYes = document.getElementById('yes-alert');
        this.buttonAlertNo = document.getElementById('no-alert');
        this.layoutCategoryButton = document.getElementById('layout-category');
       if(this.layoutCategoryButton){
           this.layoutCategoryButton.classList.add('active')
       }
        this.layoutIncomeButton = document.getElementById('layout-income');
        if(this.layoutIncomeButton){
           this.layoutIncomeButton.classList.add('active')
       }


        this.createContent().then();
    }

   private async createContent(): Promise<void> {
        this.incomes = await this.getIncomes();
        if(this.mainTitleElement){
            this.mainTitleElement.innerText = this.mainTitle;
        }
        this.incomes.forEach(element => {
            const card: HTMLElement = CardCreate.cardCreateIncomesOrExpenses(element.title);
            const buttonDelete: Element | null = card.querySelector('.delete')
            if(buttonDelete){
                buttonDelete.addEventListener('click', (event) => {
                    event.stopPropagation();
                    this.deleteIncome(element);
                });
            }
            const buttonEdit: Element | null = card.querySelector('.edit')
           if (buttonEdit){
               buttonEdit.addEventListener('click', (event) => {
                   event.stopPropagation();
                   this.editIncome(element);
               });
           }

            if(this.cardsElement) {
                this.cardsElement.appendChild(card);
            }


        });

        if(this.cardsElement&&this.cardAdd) {
            this.cardAdd.innerHTML =
                '            <div class="mx-auto my-auto">\n' +
                '                <img src="../../images/plus.png" alt="+" class="plus">\n' +
                '            </div>';
            this.cardsElement.appendChild(this.cardAdd);
            this.addIncomeElement = document.getElementById('add');
           if(this.addIncomeElement){
               this.addIncomeElement.addEventListener('click', this.addIncome.bind(this));
           }
        }
    }

   private async getIncomes(): Promise<CategoriesArray> {
        const result: CategoryResponse = await HttpUtils.request(this.url);
        if (result.error) {
            console.log(result.response.message)
            return [];
        }
        return result.response;
    }

   private editIncome(element: Category): void {

        if (LocalStorageUtil.getCategory()) {
            LocalStorageUtil.removeCategory()
        }
        LocalStorageUtil.setCategory(element);
        window.location.href = '#/edit-category-income'
    }


   private async deleteIncome(element: Category): Promise<void> {
        const isConfirmed: boolean = await this.popupAlertBehaviour();
        if (isConfirmed) {
            const operations: OperationsArray = await this.getOperations();
            if (operations.length > 0) {
                operations.forEach(operation => {
                    if (operation.category === element.title) {
                        this.deleteOperation(operation.id);
                    }
                });
            }
            const result: SimpleResponseType = await HttpUtils.request(this.url + '/' + element.id, 'DELETE');
            if (result.error) {
                console.log(result.message)
                return;
            }
            window.location.href = '#/income'
        }
    }

   private async getOperations(period: string = 'all'): Promise<OperationsArray> {
        const result: OperationsResponse = await HttpUtils.request(this.urlOperations + '?period=' + period);
        if (result.error) {
            console.log(result.response.message)
            return [];
        }
        return !result.response ? [] : result.response;
    }

   private async deleteOperation(id: number): Promise<void> {
        const result: SimpleResponseType = await HttpUtils.request(this.urlOperations + '/' + id, 'DELETE');
        if (result.error) {
            console.log(result.message)
        }
    }

   private addIncome(): void {
        window.location.href = '#/create-category-income';

    }

   private popupAlertBehaviour(): Promise<boolean> {
        return new Promise((resolve) => {
            if (this.allertElement)
            this.allertElement.style.display = 'flex';
            if (this.buttonAlertNo)
            this.buttonAlertNo.addEventListener('click', () => {
                if (this.allertElement)
                this.allertElement.style.display = 'none';
                resolve(false);
            });
            if (this.buttonAlertYes)
                this.buttonAlertYes.addEventListener('click', () => {
                if (this.allertElement)
                this.allertElement.style.display = 'none';
                resolve(true);
            });
        });
    }
}