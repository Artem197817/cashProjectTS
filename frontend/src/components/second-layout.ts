import {Calendar, FormatDateString} from 'vanilla-calendar-pro';
import {IncomeAndExpenses} from "./operation/income-expenses";
import {Dashboard} from "./dashboard";


export class SecondLayout {
    readonly buttonsBlockElement: HTMLElement[]
    readonly buttonToday: HTMLElement | null = null;
    readonly buttonMonth: HTMLElement | null = null;
    readonly buttonYear: HTMLElement | null = null;
    readonly buttonWeek: HTMLElement | null = null;

    constructor() {
        this.buttonsBlockElement = Array.from(document.querySelectorAll('.btn-outline-secondary')) as HTMLElement[];
        if(this.buttonsBlockElement) {
            this.buttonsBlockElement.forEach(button => {
                button.addEventListener('click', () => {
                    if(this.buttonsBlockElement)
                        this.buttonsBlockElement.forEach(btn => btn.classList.remove('active'));
                    button.classList.add('active');
                });
            });
        }


        this.buttonToday = document.getElementById('btn-today');
        if (this.buttonToday) {
            this.buttonToday.addEventListener('click', () => {
                this.updateTo('')
            });
        }

        this.buttonWeek = document.getElementById('btn-week');
        if (this.buttonWeek) {
            this.buttonWeek.addEventListener('click', () => {
                this.updateTo('week')
            });
        }

        this.buttonMonth = document.getElementById('btn-month');
        if (this.buttonMonth) {
            this.buttonMonth.addEventListener('click', () => {
                this.updateTo('month')
            });
        }

        this.buttonYear = document.getElementById('btn-year');
        if (this.buttonYear) {
            this.buttonYear.addEventListener('click', () => {
                this.updateTo('year')
            });
        }
    }

   private updateTo(period: string = 'all', dateFilterFrom: FormatDateString | null = null, dateFilterTo: FormatDateString | null = null) {
        const pathname: string[] = window.location.href.split('/');
        const page: string = pathname[pathname.length - 1];
        if (page === 'income-and-expenses') {
            IncomeAndExpenses.updateTable(period, dateFilterFrom, dateFilterTo).then();
        } else {
            Dashboard.updateDiag(period, dateFilterFrom, dateFilterTo).then();
        }
    }

}

