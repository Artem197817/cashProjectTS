import {HttpUtils} from "../utils/http-utils";
import {CardCreate} from "../utils/card-create";
import {Layout} from "./layout";
import {LocalStorageUtil} from "../utils/localStorageUtil";

export class IncomeAndExpenses {
    url = '/operations'

    mainTitle = 'Доходы и расходы'

    constructor(calendar) {
        this.mainTitleElement = document.getElementById('main-title');
        this.mainTitleElement.innerText = this.mainTitle;
        this.tbodyElement = document.getElementById('tbody');
        this.allertElement = document.getElementById('alert-popup-block');
        this.buttonAlertYes = document.getElementById('yes-alert');
        this.buttonAlertNo = document.getElementById('no-alert');
        this.popupTextElement = document.getElementById('text-popup-income');
        this.popupTextElement.style.color = 'white';
        this.asideElement = document.getElementById('aside');
        this.burger = document.getElementById('burger-menu');
        this.close = document.getElementById('close-menu');
        this.layoutOperationButton = document.getElementById('layout-operation');
        this.layoutOperationButton.classList.add('active')
        this.createIncomeButton = document.getElementById('create-income');
        this.createExpenseButton = document.getElementById('create-expense');
        this.createIncomeButton.addEventListener('click', () => {
            sessionStorage.setItem('type', 'income');
            window.location.href = '#/operation';
        });
        this.createExpenseButton.addEventListener('click', () => {
            sessionStorage.setItem('type', 'expense');
            window.location.href = '#/operation';
        });

        this.createContent().then();

        window.onload = this.sidebarBehaviour.bind(this);
        window.onresize = this.sidebarBehaviour.bind(this);

    }

    async createContent(operations = null) {
        if (!operations) {
            operations = await this.getOperations();

        }
        if (operations) {
            operations.forEach(operation => {

                const row = CardCreate.createRowTable(operation);

                const unionIcon = row.querySelector('.union');
                unionIcon.addEventListener('click', (event) => {
                    event.stopPropagation();
                    this.deleteOperation(operation.id);
                });

                const pencilIcon = row.querySelector('.pencil');
                pencilIcon.addEventListener('click', (event) => {
                    event.stopPropagation();
                    this.editOperation(operation)
                });

                this.tbodyElement.appendChild(row);
            });
        }
    }

    sidebarBehaviour() {
        const width = window.innerWidth;
        if (width > 849) {
            this.asideElement.classList.remove('for-table');
            this.asideElement.classList.remove('hidden-for-table');
            this.burger.style.display = 'none';
            this.close.style.display = 'none';

        } else {
            this.asideElement.classList.add('for-table');
            this.asideElement.classList.add('hidden-for-table');
            this.burger.style.display = 'block';
            this.close.style.display = 'block';
        }

    }

    editOperation(operation) {
        if (LocalStorageUtil.getOperation()) {
            LocalStorageUtil.removeOperation()
        }
        LocalStorageUtil.setOperation(operation);
        window.location.href = '#/operation-edit'
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

    async deleteOperation(id) {
        const isConfirmed = await this.popupAlertBehaviour();
        if (isConfirmed) {
            const result = await HttpUtils.request(this.url + '/' + id, 'DELETE');
            if (result.error) {
                console.log(result.message)
                return;
            }
            this.tbodyElement.innerHTML = '';
            this.createContent().then();
            Layout.setBalance().then();
        }
    }

    async getOperations(period = 'all', dateFilterFrom = null, dateFilterTo = null) {
        const result = await HttpUtils.request(this.url + '?period=' + period
            + '&dateFrom=' + dateFilterFrom + '&dateTo=' + dateFilterTo);
        if (result.error) {
            console.log(result.message)
            return [];
        }
        return !result.response ? [] : result.response;
    }

    static async updateTable(period = 'all', dateFilterFrom = null, dateFilterTo = null) {

        const incomeAndExpenses = new IncomeAndExpenses();
        const tbodyElement = document.getElementById('tbody');
        const operations = await incomeAndExpenses.getOperations(period, dateFilterFrom, dateFilterTo);
        tbodyElement.innerHTML = '';
        incomeAndExpenses.createContent(operations).then();
    }


}