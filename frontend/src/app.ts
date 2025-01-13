import "./css/style.scss";
import {Router} from "./router";

class App {

    readonly router: Router;

    constructor() {
        this.router = new Router();
        window.addEventListener('DOMContentLoaded', () => {
            this.router.openRoute();
        });
        window.addEventListener('popstate', () => {
            this.router.openRoute();
        });
    }
}

(new App());