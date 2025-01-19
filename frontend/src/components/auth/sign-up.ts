import {AuthUtil} from "../../utils/auth-util";
import {HttpUtils} from "../../utils/http-utils";
import {ApiResponse} from "../../types/auth-response.type";

export class SignUp {

    readonly emailElement: HTMLElement | null;
    readonly passwordElement: HTMLElement | null;
    readonly repeatPasswordElement: HTMLElement | null;
    readonly fullNameElement: HTMLElement | null;
    readonly commonErrorElement: HTMLElement | null;
    readonly buttonLoginElement: HTMLElement | null;

    constructor() {

        if (AuthUtil.getAuthInfo(AuthUtil.accessTokenKey)) {
            window.location.href = "#/";
        }

        this.emailElement = document.getElementById('email');
        this.passwordElement = document.getElementById('password');
        this.repeatPasswordElement = document.getElementById('repeat-password');
        this.fullNameElement = document.getElementById('fullName');
        this.buttonLoginElement = document.getElementById('button-login');
        this.commonErrorElement = document.getElementById('common-error');
        if(this.buttonLoginElement){
        this.buttonLoginElement.addEventListener('click',
            this.signUp.bind(this));
        }
    }

   private async signUp(): Promise<void> {

       if (this.commonErrorElement) {
           this.commonErrorElement.style.display = 'none';
       }
       if (this.validateForm() && this.fullNameElement) {
           const fullNameSplit: string[] = (this.fullNameElement as HTMLInputElement).value.split(' ');
           let userName: string = 'unknown';
           let userLastName: string = 'unknown';

           if (fullNameSplit.length > 1) {
               userLastName = fullNameSplit[0];
               userName = fullNameSplit[1];
           }

           if (this.emailElement && this.passwordElement && this.repeatPasswordElement && this.fullNameElement) {
               const result: ApiResponse = await HttpUtils.request('/signup', 'POST', false,
                   {
                       name: userName,
                       lastName: userLastName,
                       email: (this.emailElement as HTMLInputElement).value,
                       password: (this.passwordElement as HTMLInputElement).value,
                       passwordRepeat: (this.repeatPasswordElement as HTMLInputElement).value,
                   })

               if (result.error || !result.response || (result.response && !result.response.user.id
                   || !result.response.user.email || !result.response.user.name || !result.response.user.lastName)) {
                   if (this.commonErrorElement)
                       this.commonErrorElement.style.display = 'block';
                   return
               }
           }
           window.location.href = "#/login";
       }
   }
   private validateForm():boolean {
        let isValid:boolean = true;

        if(this.fullNameElement && this.passwordElement && this.emailElement
            && this.repeatPasswordElement && this.fullNameElement) {
            if ((this.fullNameElement as HTMLInputElement).value.trim()) {
                this.fullNameElement.classList.remove('is-invalid');
            } else {
                this.fullNameElement.classList.add('is-invalid');
                isValid = false;
            }

            if ((this.emailElement as HTMLInputElement).value.trim() && /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test((this.emailElement as HTMLInputElement).value)) {
                this.emailElement.classList.remove('is-invalid');
            } else {
                this.emailElement.classList.add('is-invalid');
                isValid = false;
            }

            if ((this.passwordElement as HTMLInputElement).value.trim() && /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,}$/.test((this.passwordElement as HTMLInputElement).value)) {
                this.passwordElement.classList.remove('is-invalid');
            } else {
                this.passwordElement.classList.add('is-invalid');
                isValid = false;
            }
            if ((this.passwordElement as HTMLInputElement).value.trim() === (this.repeatPasswordElement as HTMLInputElement).value.trim()) {
                this.repeatPasswordElement.classList.remove('is-invalid');
            } else {
                this.repeatPasswordElement.classList.add('is-invalid');
                isValid = false;
            }
        }
        return isValid;
    }
}