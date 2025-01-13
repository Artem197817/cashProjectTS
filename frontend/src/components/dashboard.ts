import {Chart, registerables} from 'chart.js';
Chart.register(...registerables);
import {HttpUtils} from "../utils/http-utils";

export class Dashboard {
    url = '/operations'
    mainTitle = 'Главная'
    colors = [
        "#FF5733",
        "#33FF57",
        "#3357FF",
        "#FF33A1",
        "#F0FF33",
        "#33FFF5",
        "#FF8C33",
        "#B833FF",
        "#581845",
        "#338CFF",
        "#FFC300",
        "#DAF7A6",
        "#C70039",
        "#900C3F",
        "#FFC0CB",
        "#A52A2A",
        "#D2691E",
        "#20B2AA",
        "#FF4500",
        "#2E8B57",
        "#6A5ACD",
        "#FFD700",
        "#ADFF2F",
        "#FF6347",
        "#00FA9A",
        "#7B68EE",
        "#DDA0DD",
        "#F08080",
        "#33FF8C",
    ];

    constructor() {
        this.mainTitleElement = document.getElementById('main-title');
        this.mainTitleElement.innerText = this.mainTitle;
        this.canvasIncome = document.getElementById('canvas-income').getContext('2d');
        this.canvasExpenses = document.getElementById('canvas-expenses').getContext('2d');
        this.buttonsFin = document.getElementById('btn-block-fin');
        this.buttonsFin.style.display = 'none';
        this.layoutMainButton = document.getElementById('layout-main');
        this.layoutMainButton.classList.add('active')

        this.createData().then();
    }

    async createData(operations = null) {
        if (!operations) {
            operations = await this.getOperations();
        }
        if (operations) {
            const expenses = operations.filter(item => item.type === 'expense');
            const incomes = operations.filter(item => item.type === 'income');

            function aggregateByCategory(items) {
                return items.reduce((accumulator, current) => {
                    const category = current.category;
                    const amount = current.amount;

                    if (!accumulator[category]) {
                        accumulator[category] = {category: category, total: 0};
                    }

                    accumulator[category].total += amount;

                    return accumulator;
                }, {});
            }

            const aggregatedExpenses = Object.values(aggregateByCategory(expenses));
            const aggregatedIncomes = Object.values(aggregateByCategory(incomes));

            this.dataIncome = {};
            this.dataIncome.labels = [];
            const labelIncome = 'Расходы';
            let index = 0;
            let incomeTotal = [];
            let backgroundColorsI = [];
            aggregatedIncomes.forEach(item => {
                this.dataIncome.labels.push(item.category);
                incomeTotal.push(item.total);
                if (index > this.colors.length - 1) {
                    index = 0;
                }
                backgroundColorsI.push(this.colors[index++]);
            });
            this.dataIncome.datasets = [{
                label: labelIncome,
                data: incomeTotal,
                backgroundColor: backgroundColorsI,
                borderColor: backgroundColorsI,
            }]

            this.dataExpenses = {};
            this.dataExpenses.labels = [];
            const labelExpenses = 'Расходы';
            index = 0;
            let expensesTotal = [];
            let backgroundColors = [];
            aggregatedExpenses.forEach(item => {
                this.dataExpenses.labels.push(item.category);
                expensesTotal.push(item.total);
                if (index > this.colors.length - 1) {
                    index = 0;
                }
                backgroundColors.push(this.colors[index++]);
            });
            this.dataExpenses.datasets = [{
                label: labelExpenses,
                data: expensesTotal,
                backgroundColor: backgroundColors,
                borderColor: backgroundColors,
            }]

            if (Dashboard.chartIncome) {
                Dashboard.chartIncome.destroy();
            }
            if (Dashboard.chartExpenses) {
                Dashboard.chartExpenses.destroy();
            }

            Dashboard.chartIncome = new Chart(this.canvasIncome, this.getConfig(this.dataIncome));
            Dashboard.chartExpenses = new Chart(this.canvasExpenses, this.getConfig(this.dataExpenses));

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

    static async updateDiag(period = 'all', dateFilterFrom = null, dateFilterTo = null) {

        const dashboard = new Dashboard();
        dashboard.updateDiagram(period, dateFilterFrom, dateFilterTo).then();
    }

    async updateDiagram(period = 'all', dateFilterFrom = null, dateFilterTo = null) {
        console.log(Dashboard.chartIncome)
        console.log(Dashboard.chartExpenses)

        const operations = await this.getOperations(period, dateFilterFrom, dateFilterTo);
        this.createData(operations).then();
    }

    getConfig(data) {

        return {
            type: 'pie',
            data: data,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },

                }
            },
        };
    }

}
