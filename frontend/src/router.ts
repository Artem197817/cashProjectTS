import {Dashboard} from "./components/dashboard";
import {Login} from "./components/auth/login";
import {SignUp} from "./components/auth/sign-up";
import {Logout} from "./components/auth/logout";
import {AuthUtil} from "./utils/auth-util";
import {Income} from "./components/income/income";
import {Layout} from "./components/layout";
import {Expenses} from "./components/expenses/expenses";
import {CreateCategoryIncomes} from "./components/income/create-category-incomes";
import {CreateCategoryExpenses} from "./components/expenses/create-category-expenses";
import {EditCategoryIncomes} from "./components/income/edit-category-income";
import {EditCategoryExpenses} from "./components/expenses/edit-category-expenses";
import {IncomeAndExpenses} from "./components/operation/income-expenses";
import {CreateOperation} from "./components/operation/create-operation";
import {SecondLayout} from "./components/second-layout";
import {EditOperation} from "./components/operation/edit-operation";
import {CalendarUtils} from "./utils/calendar";
import {RouteType} from "./types/route.type";
import {Calendar} from "vanilla-calendar-pro";

export class Router {
    readonly pageTitleElement: HTMLElement | null;
    readonly contentElement: HTMLElement | null;
    readonly adminLteStyleElement: HTMLElement | null;
    private routes: RouteType[];
    private calendar: Calendar| null = null;
    private currentRoute: RouteType= {
        route: '#/',
        template: '/templates/pages/dashboard.html',
        load: () => {},
    };

    constructor() {
        this.pageTitleElement = document.getElementById("page-title");
        this.contentElement = document.getElementById("content");
        this.adminLteStyleElement = document.getElementById("adminlte_style");


        this.routes = [
            {
                route: '#/',
                title: 'Dashboard',
                template: '/templates/pages/dashboard.html',
                useLayout: '/templates/layout.html',
                useSecondLayout: '/templates/second-layout.html',
                requiresAuth: true,

                load: () => {
                    new Layout();
                    new SecondLayout();
                    this.calendar = new CalendarUtils().calendar;
                    new Dashboard();
                },
                unload: () => {
                    if (this.calendar) {
                        this.calendar.destroy();
                    }
                },

            },
            {
                route: '#/404',
                title: 'Page Not Found',
                template: '/templates/pages/404.html',
            },
            {
                route: '#/login',
                title: 'Login',
                template: '/templates/pages/login.html',
                load: () => {
                    new Login();
                },
                unload: () => {

                },

            },
            {
                route: '#/sign-up',
                title: 'Sign Up',
                template: '/templates/pages/sign-up.html',
                load: () => {
                    new SignUp();
                },
                unload: () => {
                    document.body.classList.remove('register-page');
                    document.body.style.height = 'auto';
                },

            },
            {
                route: '#/logout',
                load: () => {
                    new Logout();
                }
            },
            {
                route: '#/income',
                title: 'Доходы',
                template: '/templates/pages/finance.html',
                useLayout: '/templates/layout.html',
                requiresAuth: true,
                load: () => {
                    new Layout();
                    new Income();
                },
                unload: () => {

                },

            },
            {
                route: '#/expenses',
                title: 'Расходы',
                template: '/templates/pages/finance.html',
                useLayout: '/templates/layout.html',
                requiresAuth: true,
                load: () => {
                    new Layout();
                    new Expenses();
                },
                unload: () => {

                },

            },
            {
                route: '#/create-category-income',
                title: 'Создание категории доходов',
                template: '/templates/pages/card-create.html',
                useLayout: '/templates/layout.html',
                requiresAuth: true,
                load: () => {
                    new Layout();
                    new CreateCategoryIncomes();
                },
                unload: () => {

                },

            },
            {
                route: '#/create-category-expenses',
                title: 'Создание категории доходов',
                template: '/templates/pages/card-create.html',
                useLayout: '/templates/layout.html',
                requiresAuth: true,
                load: () => {
                    new Layout();
                    new CreateCategoryExpenses();
                },
                unload: () => {

                },

            },
            {
                route: '#/edit-category-income',
                title: 'Редактирование категории доходов',
                template: '/templates/pages/card-create.html',
                useLayout: '/templates/layout.html',
                requiresAuth: true,
                load: () => {
                    new Layout();
                    new EditCategoryIncomes();
                },
                unload: () => {

                },

            },
            {
                route: '#/edit-category-expenses',
                title: 'Редактирование категории расходов',
                template: '/templates/pages/card-create.html',
                useLayout: '/templates/layout.html',
                requiresAuth: true,
                load: () => {
                    new Layout();
                    new EditCategoryExpenses();
                },
                unload: () => {

                },

            },
            {
                route: '#/income-and-expenses',
                title: 'Расходы и доходы',
                template: '/templates/pages/income-expenses.html',
                useLayout: '/templates/layout.html',
                useSecondLayout: '/templates/second-layout.html',
                requiresAuth: true,

                load: () => {
                    new Layout();
                    new SecondLayout();
                    this.calendar = new CalendarUtils().calendar;
                    new IncomeAndExpenses();
                },
                unload: () => {
                    if (this.calendar) {
                        this.calendar.destroy();
                    }
                },
            },
            {
                route: '#/operation',
                title: 'Создать доход/расход',
                template: '/templates/pages/operation.html',
                useLayout: '/templates/layout.html',
                requiresAuth: true,
                load: () => {
                    new Layout();
                    new CreateOperation();
                },
                unload: () => {

                },

            },
            {
                route: '#/operation-edit',
                title: 'Создать доход/расход',
                template: '/templates/pages/operation.html',
                useLayout: '/templates/layout.html',
                requiresAuth: true,
                load: () => {
                    new Layout();
                    new EditOperation();
                },
                unload: () => {

                },

            },
        ];
    }

    public async openRoute(): Promise<void> {

        const urlRoute: string = window.location.hash.split('?')[0];
        const newRoute: RouteType | undefined = this.routes.find(item => item.route === urlRoute);

        if (!newRoute) {
            window.location.href = "#/";
            return;
        }
        if (!AuthUtil.getAuthInfo(AuthUtil.accessTokenKey) && newRoute.requiresAuth) {
            window.location.href = '#/login';
            return;
        }
        const oldRoute: RouteType | null = this.currentRoute;

        if (oldRoute && oldRoute.unload && typeof oldRoute.unload === 'function') {
            oldRoute.unload();
        }
        try {

            await this.loadTemplate(newRoute);
            if(newRoute.styles){
                this.applyStyles(newRoute.styles);
            }
            if (this.pageTitleElement) {
                this.pageTitleElement.innerText = <string>newRoute.title;
            }


            if (newRoute.load && typeof newRoute.load === 'function') {
                newRoute.load();
            }
        } catch (error) {
            console.error('Error opening route:', error);
            location.href = '#/404';
        }
        this.currentRoute = newRoute;
    }

  private  async loadTemplate(route: RouteType): Promise<void> {
        let contentBlock: HTMLElement | null = this.contentElement;

        if (route.useLayout && contentBlock) {
            try {
                const layoutResponse: Response = await fetch(route.useLayout);
                if (!layoutResponse.ok) throw new Error('Failed to load layout');

                contentBlock.innerHTML = await layoutResponse.text();
                contentBlock = document.getElementById('content-layout');
                if (route.useSecondLayout && contentBlock) {
                    const layoutResponse: Response = await fetch(route.useSecondLayout);
                    if (!layoutResponse.ok) throw new Error('Failed to load layout');

                    contentBlock.innerHTML = await layoutResponse.text();
                    contentBlock = document.getElementById('main-content');
                }
            } catch (error) {
                console.error('Error loading layout:', error);
                throw error;
            }
        }

        try {
            if(route.template) {
                const templateResponse: Response = await fetch(route.template);
                if (!templateResponse.ok) throw new Error('Failed to load template');
                if (contentBlock) {
                    contentBlock.innerHTML = await templateResponse.text();
                }
            }
        } catch (error) {
            console.error('Error loading template:', error);
            throw error;
        }
    }

  private  async activateRoute(e: any, oldRoute:RouteType |string| null = null): Promise<void> {

        if (oldRoute) {
            const currentRoute:RouteType | undefined = this.routes.find(item => item.route === oldRoute);

            if (currentRoute && currentRoute.styles && currentRoute.styles.length > 0) {
                currentRoute.styles.forEach(style => {
                    const styleLink = document.querySelector(`link[href='/css/${style}']`);
                    if (styleLink) {
                        styleLink.remove();
                    }
                });

                if (currentRoute.unload && typeof currentRoute.unload === 'function') {
                    currentRoute.unload();
                }
            }
        }

        const urlRoute:string = window.location.hash.split('?')[0];
        const newRoute:RouteType | undefined = this.routes.find(item => item.route === urlRoute);

        if (newRoute?.styles) {
            this.applyStyles(newRoute.styles);

            if (newRoute.title && this.pageTitleElement) {
                this.pageTitleElement.innerText = newRoute.title;
            }

            await this.loadTemplate(newRoute);

            if (newRoute.load && typeof newRoute.load === 'function') {
                newRoute.load();
            }
        } else {
            console.log('No route found');
            location.href = '#/404';
        }
    }

   private applyStyles(styles: string[] | null): void {
        if (styles && styles.length > 0) {
            styles.forEach(style => {
                const existingStyleLink:HTMLElement | null = document.querySelector(`link[href='/css/${style}']`);

                if (!existingStyleLink) {
                    const link:HTMLLinkElement  = document.createElement("link");
                    link.rel = "stylesheet";
                    link.href = '/css/' + style;

                    link.onerror = () => {
                        console.error(`Failed to load stylesheet: ${link.href}`);
                    };
                    if(this.adminLteStyleElement)
                    document.head.insertBefore(link, this.adminLteStyleElement);
                }
            });
        }
    }
}