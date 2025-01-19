import {IncomeAndExpenses} from "../components/operation/income-expenses";
import {Dashboard} from "../components/dashboard";
import {Calendar, FormatDateString} from 'vanilla-calendar-pro';

export class CalendarUtils {
    public calendar: Calendar | null = null;
    readonly buttonInterval: HTMLElement|null = null;

    constructor() {
        this.buttonInterval = document.getElementById('interval');
        this.calendar = this.init();

    }

   private init(): Calendar | null {
        let calendar: Calendar | null = null;
        if (this.buttonInterval) {
            calendar = new Calendar(this.buttonInterval, {
                inputMode: true,
                selectionDatesMode: 'multiple-ranged',
                locale: 'ru-RU',
                onClickDate(self: Calendar): void {
                    const arrDate: FormatDateString[] = self.context.selectedDates;
                    if (arrDate && arrDate.length === 2) {
                        if (arrDate[1] && arrDate[0]) {
                            if (arrDate[0] > arrDate[1]) {
                                let tempDate: FormatDateString = arrDate[0];
                                arrDate[0] = arrDate[1];
                                arrDate[1] = tempDate;
                            }
                            const dateFilterFromElement:HTMLElement | null = document.getElementById('link-interval-start');
                           if(dateFilterFromElement) {
                               dateFilterFromElement.innerText = arrDate[0];
                           }
                            const dateFilterToElement:HTMLElement | null = document.getElementById('link-interval-end');
                           if(dateFilterToElement) {
                               dateFilterToElement.innerText = arrDate[1];
                           }

                            const pathname: string[] = window.location.href.split('/');
                            const page: string = pathname[pathname.length - 1];
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
        if(this.calendar){
            this.calendar.destroy();
        }
    }
}