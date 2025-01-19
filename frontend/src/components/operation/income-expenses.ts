import {HttpUtils} from "../../utils/http-utils";
import {CardCreate} from "../../utils/card-create";
import {Layout} from "../layout";
import {LocalStorageUtil} from "../../utils/localStorageUtil";
import {Operation, OperationsArray, OperationsResponse} from "../../types/operations.type";
import {SimpleResponseType} from "../../types/simple-response.type";
import {FormatDateString} from "vanilla-calendar-pro";

export class IncomeAndExpenses {
    private url: string = '/operations'
    private mainTitle: string = 'Доходы и расходы'
    readonly mainTitleElement: HTMLElement | null = null;
    readonly tbodyElement: HTMLElement | null = null;
    readonly allertElement: HTMLElement | null = null;
    readonly buttonAlertYes: HTMLElement | null = null;
    readonly buttonAlertNo: HTMLElement | null = null;
    readonly popupTextElement: HTMLElement | null = null;
    readonly asideElement: HTMLElement | null = null;
    readonly burger: HTMLElement | null = null;
    readonly close: HTMLElement | null = null;
    readonly createIncomeButton: HTMLElement | null = null;
    readonly layoutOperationButton: HTMLElement | null = null;
    readonly createExpenseButton: HTMLElement | null = null;


    constructor() {
        this.mainTitleElement = document.getElementById('main-title');
        if (this.mainTitleElement) {
            this.mainTitleElement.innerText = this.mainTitle;
        }
        this.tbodyElement = document.getElementById('tbody');
        this.allertElement = document.getElementById('alert-popup-block');
        this.buttonAlertYes = document.getElementById('yes-alert');
        this.buttonAlertNo = document.getElementById('no-alert');
        this.popupTextElement = document.getElementById('text-popup-income');
        if (this.popupTextElement) {
            this.popupTextElement.style.color = 'white';
        }
        this.asideElement = document.getElementById('aside');
        this.burger = document.getElementById('burger-menu');
        this.close = document.getElementById('close-menu');
        this.layoutOperationButton = document.getElementById('layout-operation');
        if (this.layoutOperationButton) {
            this.layoutOperationButton.classList.add('active')
        }
        this.createIncomeButton = document.getElementById('create-income');
        this.createExpenseButton = document.getElementById('create-expense');
        if (this.createIncomeButton)
            this.createIncomeButton.addEventListener('click', () => {
                sessionStorage.setItem('type', 'income');
                window.location.href = '#/operation';
            });
        if (this.createExpenseButton)
            this.createExpenseButton.addEventListener('click', () => {
                sessionStorage.setItem('type', 'expense');
                window.location.href = '#/operation';
            });

        this.createContent().then()

        window.onload = this.sidebarBehaviour.bind(this);
        window.onresize = this.sidebarBehaviour.bind(this);

    }

    private async createContent(operations: Operation[] | null = null): Promise<void> {
        if (!operations) {
            operations = await this.getOperations();

        }
        if (operations) {
            operations.forEach(operation => {

                const row: HTMLElement = CardCreate.createRowTable(operation);

                const unionIcon: HTMLElement | null = row.querySelector('.union');
                if (unionIcon) {
                    unionIcon.addEventListener('click', (event) => {
                        event.stopPropagation();
                        this.deleteOperation(operation.id);
                    });
                }

                const pencilIcon: HTMLElement | null = row.querySelector('.pencil');
                if (pencilIcon) {
                    pencilIcon.addEventListener('click', (event) => {
                        event.stopPropagation();
                        this.editOperation(operation)
                    });
                }

                if (this.tbodyElement)
                    this.tbodyElement.appendChild(row);
            });
        }
    }

    private sidebarBehaviour(): void {
        const width: number = window.innerWidth;
        if (this.asideElement && this.burger && this.close) {
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
    }

    private editOperation(operation: Operation): void {
        if (LocalStorageUtil.getOperation()) {
            LocalStorageUtil.removeOperation()
        }
        LocalStorageUtil.setOperation(operation);
        window.location.href = '#/operation-edit'
    }


    private popupAlertBehaviour(): Promise<boolean> {
        return new Promise((resolve) => {
            if (this.allertElement) {
                this.allertElement.style.display = 'flex';
            }

            if (this.buttonAlertNo) {
                this.buttonAlertNo.addEventListener('click', () => {
                    if (this.allertElement)
                        this.allertElement.style.display = 'none';
                    resolve(false);
                });
            }

            if (this.buttonAlertYes) {
                this.buttonAlertYes.addEventListener('click', () => {
                    if (this.allertElement)
                        this.allertElement.style.display = 'none';
                    resolve(true);
                });
            }
        });
    }

    private async deleteOperation(id: number): Promise<void> {
        const isConfirmed: boolean = await this.popupAlertBehaviour();
        if (isConfirmed) {
            const result: SimpleResponseType = await HttpUtils.request(this.url + '/' + id, 'DELETE');
            if (result.error) {
                console.log(result.message)
                return;
            }
            if (this.tbodyElement) {
                this.tbodyElement.innerHTML = '';
            }
            this.createContent().then();
            Layout.setBalance().then();
        }
    }

    private async getOperations(period: string = 'all', dateFilterFrom: FormatDateString | null = null,
                                dateFilterTo: FormatDateString | null = null): Promise<OperationsArray> {
        const result: OperationsResponse = await HttpUtils.request(this.url + '?period=' + period
            + '&dateFrom=' + dateFilterFrom + '&dateTo=' + dateFilterTo);
        if (result.error) {
            console.log(result.response.message)
            return [];
        }
        return !result.response ? [] : result.response;
    }

    public static async updateTable(period = 'all', dateFilterFrom: FormatDateString | null = null,
                                    dateFilterTo: FormatDateString | null = null): Promise<void> {

        const incomeAndExpenses: IncomeAndExpenses = new IncomeAndExpenses();
        const tbodyElement: HTMLElement | null = document.getElementById('tbody');
        const operations: OperationsArray = await incomeAndExpenses.getOperations(period, dateFilterFrom, dateFilterTo);
        if (tbodyElement){
            tbodyElement.innerHTML = '';
        }
        incomeAndExpenses.createContent(operations).then();
    }


}