import {AuthUtil} from "../utils/auth-util";
import {HttpUtils} from "../utils/http-utils";
import {User} from "../types/auth-response.type";
import {BalanceType} from "../types/balance.type";

export class Layout {

    public static url = '/balance';
    readonly userInfoElement: HTMLElement | null = null;
    readonly asideElement: HTMLElement | null = null;
    readonly popupUserElement: HTMLElement | null = null;
    readonly sideBarUserElement: HTMLElement | null = null;
    readonly burger: HTMLElement | null = null;
    readonly close: HTMLElement | null = null;
    private bodyElement: HTMLElement | null = null;
    private linksMain: HTMLElement[];
    readonly userInfo: User | null = null;
    readonly userName: string = '';
    private static balanceElement: HTMLElement | null = null;

    constructor() {
        this.userInfoElement = document.getElementById('username');
        const userInfoString: string | null = AuthUtil.getAuthInfo(AuthUtil.userinfoKey)
        if (userInfoString) {
            this.userInfo = JSON.parse(userInfoString);
        }
        if (this.userInfo && this.userInfoElement) {
            this.userName = this.userInfo.name + ' ' + this.userInfo.lastName;
            this.userInfoElement.innerText = this.userName;
        }
        this.asideElement = document.getElementById('aside');
        this.popupUserElement = document.getElementById('popup-user');
        this.sideBarUserElement = document.getElementById('sidebar-user-link');
        if (this.sideBarUserElement) {
            this.sideBarUserElement.addEventListener('click', () => {
                if (this.popupUserElement) {
                    this.popupUserElement.classList.toggle("active");
                }
                setTimeout(() => {
                    if (this.popupUserElement) {
                        this.popupUserElement.classList.remove("active");
                    }
                }, 3000);
            });

        }

        Layout.setBalance().then();

        this.burger = document.getElementById('burger-menu');
        if (this.burger) {
            this.burger.addEventListener('click', () => {
                if (this.asideElement) {
                    this.asideElement.classList.remove('hidden');
                    this.asideElement.classList.remove('hidden-for-table');
                }
            });
        }
        this.close = document.getElementById('close-menu');
        if (this.close) {
            this.close.addEventListener('click', () => {
                if (this.asideElement) {
                    this.asideElement.classList.add('hidden');
                    this.asideElement.classList.add('hidden-for-table');
                }
            });
        }

        this.linksMain = Array.from(document.querySelectorAll('.main-link'));
        this.linksMain.forEach(button => {
            button.classList.remove('active')
        });

        const observer = new MutationObserver(() => {
            this.sidebarBehaviour();
        });
        const config = { childList: true, subtree: true };
        observer.observe(document.body, config);
    }

    private sidebarBehaviour(): void {
        this.bodyElement = document.querySelector('body');
        const width: number = window.innerWidth;
        if (this.asideElement && this.bodyElement) {
            if (width > 849) {
                this.asideElement.style.height = `${this.bodyElement.scrollHeight}px`;
            } else {
                this.asideElement.style.height = `600px`;
            }

            if (this.bodyElement.scrollHeight < window.innerHeight) {
                this.asideElement.style.height = '100vh'
            }
        }
    }


    static async setBalance() {
        const result: BalanceType = await HttpUtils.request(this.url);
        if (result.error) {
            return;
        }

        if (result.response.balance) {
            this.balanceElement = document.getElementById('balance');
            if (this.balanceElement) {
                this.balanceElement.innerText = result.response.balance + '  $';
            }
        }
        return result.response;
    }

}
