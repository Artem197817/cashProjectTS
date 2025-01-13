import {IncomeAndExpenses} from "../components/income-expenses";
import {Dashboard} from "../components/dashboard";
import {Calendar} from 'vanilla-calendar-pro';

export class CalendarUtils {
    public calendar: CalendarUtils;
    readonly buttonInterval: HTMLElement;

    constructor() {
        this.buttonInterval = document.getElementById('interval');
        this.calendar = this.init();

    }

    init() {
        let calendar;
        if (this.buttonInterval) {
            calendar = new Calendar(this.buttonInterval, {
                inputMode: true,
                selectionDatesMode: 'multiple-ranged',
                locale: 'ru-RU',
                onClickDate(self) {
                    const arrDate = self.context.selectedDates;
                    if (arrDate && arrDate.length === 2) {
                        if (arrDate[1] && arrDate[0]) {
                            if (arrDate[0] > arrDate[1]) {
                                let tempDate = arrDate[0];
                                arrDate[0] = arrDate[1];
                                arrDate[1] = tempDate;
                            }
                            const dateFilterFromElement = document.getElementById('link-interval-start');
                            dateFilterFromElement.innerText = arrDate[0];
                            const dateFilterToElement = document.getElementById('link-interval-end');
                            dateFilterToElement.innerText = arrDate[1];
                            const pathname = window.location.href.split('/');
                            const page = pathname[pathname.length - 1];
                            if (page === 'income-and-expenses') {
                                IncomeAndExpenses.updateTable('interval', arrDate[0], arrDate[1]).then();
                            } else {
                                Dashboard.updateDiag('interval', arrDate[0], arrDate[1]).then();
                            }
                        }
                    }
                },
            });

            calendar.init();
        }
        return calendar;
    }

    destroy = () => {
        this.calendar.destroy();
    }
}