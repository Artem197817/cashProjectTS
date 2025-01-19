import {Chart, ChartConfiguration, ChartData, ChartDataset, registerables} from 'chart.js';

Chart.register(...registerables);
import {HttpUtils} from "../utils/http-utils";
import {OperationsArray, OperationsResponse} from "../types/operations.type";
import {FormatDateString} from "vanilla-calendar-pro";

export class Dashboard {
    readonly mainTitleElement: HTMLElement | null = null;
    readonly buttonsFin: HTMLElement | null = null;
    readonly canvasIncome: CanvasRenderingContext2D | null = null;
    readonly canvasExpenses: CanvasRenderingContext2D | null = null;
    private url: string = '/operations'
    private mainTitle: string = 'Главная'
    public colors: string[] = [
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
    readonly layoutMainButton: HTMLElement | null = null;
    private dataIncome: ChartData = {labels: [], datasets: []};
    private dataExpenses: ChartData = {labels: [], datasets: []};
    static chartIncome: Chart | null = null;
    static chartExpenses: Chart | null = null;

    constructor() {
        this.mainTitleElement = document.getElementById('main-title');
        if (this.mainTitleElement) {
            this.mainTitleElement.innerText = this.mainTitle;
        }

        const canvasI = document.getElementById('canvas-income') as HTMLCanvasElement | null;
        this.canvasIncome = canvasI ? canvasI.getContext('2d') : null;

        const canvasE = document.getElementById('canvas-expenses') as HTMLCanvasElement | null;
        this.canvasExpenses = canvasE ? canvasE.getContext('2d') : null;

        this.buttonsFin = document.getElementById('btn-block-fin');
        if (this.buttonsFin) {
            this.buttonsFin.style.display = 'none';
        }

        this.layoutMainButton = document.getElementById('layout-main');
        if (this.layoutMainButton) {
            this.layoutMainButton.classList.add('active');
        }


        this.createData().then();
    }

    async createData(operations: OperationsArray | null = null) {
        if (!operations) {
            operations = await this.getOperations();
        }
        if (operations) {
            const expenses: OperationsArray = operations.filter(item => item.type === 'expense');
            const incomes: OperationsArray = operations.filter(item => item.type === 'income');

            const aggregateByCategory = (items: OperationsArray) => {
                return items.reduce((accumulator, current) => {
                    const category: string = current.category;
                    const amount: number = current.amount;

                    if (!accumulator[category]) {
                        accumulator[category] = {category, total: 0};
                    }

                    accumulator[category].total += amount;

                    return accumulator;
                }, {} as Record<string, { category: string; total: number }>);
            }

            const aggregatedExpenses = Object.values(aggregateByCategory(expenses));
            const aggregatedIncomes = Object.values(aggregateByCategory(incomes));

            const labelIncome: string = 'Расходы';
            let index: number = 0;
            let incomeTotal: number[] = [];
            let backgroundColorsI: string[] = [];
            if (this.dataIncome){
                this.dataIncome.labels = []
                this.dataIncome.datasets = []
            }
            aggregatedIncomes.forEach(item => {
                if(this.dataIncome.labels){
                    this.dataIncome.labels.push(item.category);
                }
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
            }] as ChartDataset[];


            const labelExpenses: string = 'Расходы';
            index = 0;
            let expensesTotal: number[] = [];
            let backgroundColors: string[] = [];
            if (this.dataExpenses){
                this.dataExpenses.labels = []
                this.dataExpenses.datasets = []
            }
            aggregatedExpenses.forEach(item => {
                if(this.dataExpenses.labels)
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
            }]as ChartDataset[];

            if (Dashboard.chartIncome) {
                Dashboard.chartIncome.destroy();
            }
            if (Dashboard.chartExpenses) {
                Dashboard.chartExpenses.destroy();
            }

            if(this.canvasIncome && this.dataIncome){
                Dashboard.chartIncome = new Chart(this.canvasIncome, this.getConfig(this.dataIncome));
            }
            if(this.canvasExpenses && this.dataExpenses) {
                Dashboard.chartExpenses = new Chart(this.canvasExpenses, this.getConfig(this.dataExpenses));
            }
        }
    }

   private async getOperations(period:string = 'all', dateFilterFrom: FormatDateString | null = null,
                        dateFilterTo: FormatDateString | null = null): Promise<OperationsArray> {
        const result: OperationsResponse = await HttpUtils.request(this.url + '?period=' + period
            + '&dateFrom=' + dateFilterFrom + '&dateTo=' + dateFilterTo);
        if (result.error) {
            console.log(result.response.message)
            return [];
        }
        return !result.response ? [] : result.response;
    }

   public static async updateDiag(period:string = 'all', dateFilterFrom: FormatDateString | null = null,
                            dateFilterTo: FormatDateString | null = null): Promise<void> {

        const dashboard: Dashboard = new Dashboard();
        dashboard.updateDiagram(period, dateFilterFrom, dateFilterTo).then();
    }

   private async updateDiagram(period:string = 'all', dateFilterFrom: FormatDateString | null = null,
                               dateFilterTo: FormatDateString | null = null): Promise<void> {

        const operations: OperationsArray = await this.getOperations(period, dateFilterFrom, dateFilterTo);
        this.createData(operations).then();
    }

   private getConfig(data: ChartData): ChartConfiguration  {

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