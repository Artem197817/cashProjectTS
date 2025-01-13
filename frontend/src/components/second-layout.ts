import {Calendar} from 'vanilla-calendar-pro';
import {IncomeAndExpenses} from "./income-expenses";
import {Dashboard} from "./dashboard";


export class SecondLayout {

    constructor() {
        this.buttonsBlockElement = document.querySelectorAll('.btn-outline-secondary');
        this.buttonsBlockElement.forEach(button => {
            button.addEventListener('click', () => {

                this.buttonsBlockElement.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
            });
        });

        this.buttonToday = document.getElementById('btn-today');
        this.buttonToday.addEventListener('click', () => {
            this.updateTo('')
        });
        this.buttonWeek = document.getElementById('btn-week');
        this.buttonWeek.addEventListener('click', () => {
            this.updateTo('week')
        });
        this.buttonMonth = document.getElementById('btn-month');
        this.buttonMonth.addEventListener('click', () => {
            this.updateTo('month')
        });
        this.buttonYear = document.getElementById('btn-year');
        this.buttonYear.addEventListener('click', () => {
            this.updateTo('year')
        });

    }

    updateTo(period = 'all', dateFilterFrom = null, dateFilterTo = null) {
        const pathname = window.location.href.split('/');
        const page = pathname[pathname.length - 1];
        if (page === 'income-and-expenses') {
            IncomeAndExpenses.updateTable(period, dateFilterFrom, dateFilterTo).then();
        } else {
            Dashboard.updateDiag(period, dateFilterFrom, dateFilterTo);
        }
    }

}

