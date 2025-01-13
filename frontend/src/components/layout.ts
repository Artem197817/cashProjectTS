import {AuthUtil} from "../utils/auth-util";
import {HttpUtils} from "../utils/http-utils";

export class Layout {

    static url = '/balance';

    constructor() {
        this.userInfoElement = document.getElementById('username');
        this.userInfo = JSON.parse(AuthUtil.getAuthInfo(AuthUtil.userinfoKey));
        if (this.userInfo) {
            this.userName = this.userInfo.name + ' ' + this.userInfo.lastName;
            this.userInfoElement.innerText = this.userName;
        }
        this.asideElement = document.getElementById('aside');
        this.popupUserElement = document.getElementById('popup-user');
        this.sideBarUserElement = document.getElementById('sidebar-user-link');
        this.sideBarUserElement.addEventListener('click', () => {
            this.popupUserElement.classList.toggle("active");
            setTimeout(() => {
                this.popupUserElement.classList.remove("active");
            }, 3000);
        });

        Layout.setBalance().then();

        this.burger = document.getElementById('burger-menu');
        this.burger.addEventListener('click', () => {
            this.asideElement.classList.remove('hidden');
            this.asideElement.classList.remove('hidden-for-table');
        })
        this.close = document.getElementById('close-menu');
        this.close.addEventListener('click', () => {
            this.asideElement.classList.add('hidden');
            this.asideElement.classList.add('hidden-for-table');
        })

        this.linksMain = document.querySelectorAll('.main-link');
        this.linksMain.forEach(button => {
            button.classList.remove('active')
        });
        window.onload = this.sidebarBehaviour.bind(this);
        window.onresize = this.sidebarBehaviour.bind(this);

    }

    sidebarBehaviour() {
        this.bodyElement = document.querySelector('body');
        const width = window.innerWidth;
        if (width > 849) {
            this.asideElement.style.height = `${this.bodyElement.scrollHeight}px`;
        } else {
            this.asideElement.style.height = `600px`;
        }
        if (this.bodyElement.scrollHeight < window.innerHeight) {
            this.asideElement.style.height = '100vh'
        }
    }

    static async setBalance() {
        const result = await HttpUtils.request(this.url);
        if (result.error) {
            console.log(result.message)
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
