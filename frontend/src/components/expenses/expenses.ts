import {CardCreate} from "../../utils/card-create";
import {LocalStorageUtil} from "../../utils/localStorageUtil";
import {HttpUtils} from "../../utils/http-utils";

export class Expenses {
    url = '/categories/expense';
    urlOperations = '/operations'
    mainTitle = 'Расходы'

    constructor() {
        this.mainTitleElement = document.getElementById('main-title');
        this.cardsElement = document.getElementById('cards');
        this.cardAdd = document.createElement('div');
        this.cardAdd.classList.add('card');
        this.cardAdd.setAttribute('id', 'add');
        this.allertElement = document.getElementById('alert-popup-block');
        this.buttonAlertYes = document.getElementById('yes-alert');
        this.buttonAlertNo = document.getElementById('no-alert');
        this.popupTextElement = document.getElementById('text-popup-income');
        this.popupTextElement.style.color = 'white';
        this.layoutCategoryButton = document.getElementById('layout-category');
        this.layoutCategoryButton.classList.add('active')
        this.layoutExpensesButton = document.getElementById('layout-expenses');
        this.layoutExpensesButton.classList.add('active')

        this.createContent().then();
    }

    async createContent() {
        this.expenses = await this.getExpenses();
        this.mainTitleElement.innerText = this.mainTitle;
        this.expenses.forEach(element => {
            const card = CardCreate.cardCreateIncomesOrExpenses(element.title);
            const buttonDelete = card.querySelector('.delete')
            buttonDelete.addEventListener('click', (event) => {
                event.stopPropagation();
                this.deleteExpenses(element);
            });
            const buttonEdit = card.querySelector('.edit')
            buttonEdit.addEventListener('click', (event) => {
                event.stopPropagation();
                this.editExpenses(element);
            });

            this.cardsElement.appendChild(card);

        });

        this.cardAdd.innerHTML =
            '            <div class="mx-auto my-auto">\n' +
            '                <img src="../../images/plus.png" alt="+" class="plus">\n' +
            '            </div>';
        this.cardsElement.appendChild(this.cardAdd);
        this.addExpensesElement = document.getElementById('add');
        this.addExpensesElement.addEventListener('click', this.addExpenses.bind(this));

    }

    async getExpenses() {
        const result = await HttpUtils.request(this.url);
        if (result.error) {
            console.log(result.message)
            return [];
        }
        return result.response;

    }

    editExpenses(element) {
        if (LocalStorageUtil.getCategory()) {
            LocalStorageUtil.removeCategory()
        }
        LocalStorageUtil.setCategory(element);
        window.location.href = '#/edit-category-expenses'
    }

    async deleteExpenses(element) {
        const isConfirmed = await this.popupAlertBehaviour();
        if (isConfirmed) {
            const operations = await this.getOperations();
            if (operations.length > 0) {
                operations.forEach(operation => {
                    if (operation.category === element.title) {
                        this.deleteOperation(operation.id);
                    }
                });
            }
            const result = await HttpUtils.request(this.url + '/' + element.id, 'DELETE');
            if (result.error) {
                console.log(result.message)
                return;
            }
            window.location.href = '#/expenses'
        }
    }

    async getOperations(period = 'all') {
        const result = await HttpUtils.request(this.urlOperations + '?period=' + period);
        if (result.error) {
            console.log(result.message)
            return [];
        }
        return !result.response ? [] : result.response;
    }

    async deleteOperation(id) {
        const result = await HttpUtils.request(this.urlOperations + '/' + id, 'DELETE');
        if (result.error) {
            console.log(result.message)
        }
    }

    addExpenses() {
        window.location.href = '#/create-category-expenses';
    }

    popupAlertBehaviour() {
        return new Promise((resolve) => {
            this.allertElement.style.display = 'flex';

            this.buttonAlertNo.addEventListener('click', () => {
                this.allertElement.style.display = 'none';
                resolve(false);
            });

            this.buttonAlertYes.addEventListener('click', () => {
                this.allertElement.style.display = 'none';
                resolve(true);
            });
        });
    }
}