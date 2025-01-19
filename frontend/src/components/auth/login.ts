import {AuthUtil} from "../../utils/auth-util";
import {HttpUtils} from "../../utils/http-utils";
import {ApiResponse} from "../../types/auth-response.type";

export class Login {

    readonly emailElement: HTMLElement | null = null;
    readonly passwordElement: HTMLElement | null = null;
    readonly rememberMeElement: HTMLElement | null = null;
    readonly commonErrorElement: HTMLElement | null = null;
    readonly buttonLoginElement: HTMLElement | null = null;


    constructor() {

        if (AuthUtil.getAuthInfo(AuthUtil.accessTokenKey)) {
            window.location.href = "#/";
        }

        this.emailElement = document.getElementById('email');
        this.passwordElement = document.getElementById('password');
        this.rememberMeElement = document.getElementById('remember');
        this.commonErrorElement = document.getElementById('common-error');
        this.buttonLoginElement = document.getElementById('button-login');
        if(this.buttonLoginElement){
            this.buttonLoginElement.addEventListener('click',
                this.login.bind(this));
        }

    }

   private validateForm(): boolean {
        let isValid:boolean = true;
        if(this.emailElement && this.passwordElement) {
            if ((this.emailElement as HTMLInputElement).value.trim()) {
                this.emailElement.classList.remove('is-invalid');

            } else {
                this.emailElement.classList.add('is-invalid');
                isValid = false;
            }
            if ((this.passwordElement as HTMLInputElement).value.trim()) {
                this.passwordElement.classList.remove('is-invalid');
            } else {
                this.passwordElement.classList.add('is-invalid');
                isValid = false;
            }
        }
        return isValid;
    }

   private async login(): Promise<void> {
        if (this.commonErrorElement){
            this.commonErrorElement.style.display = 'none';
        }
        if (this.validateForm()) {
            const result: ApiResponse = await HttpUtils.request('/login', 'POST', false,
                {
                    email: (this.emailElement as HTMLInputElement).value,
                    password: (this.passwordElement as HTMLInputElement).value,
                    rememberMe: (this.rememberMeElement as HTMLInputElement).checked
                })


            if (result.error || !result.response || (result.response && !result.response.tokens.accessToken
                || !result.response.tokens.refreshToken || !result.response.user)) {
                if (this.commonErrorElement) {
                    this.commonErrorElement.style.display = 'block';
                }
                return
            }

            AuthUtil.setAuthInfo(result.response.tokens.accessToken, result.response.tokens.refreshToken, result.response.user);


            window.location.href = "#/";
        }
    }
}