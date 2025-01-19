import {AuthUtil} from "../../utils/auth-util";
import {HttpUtils} from "../../utils/http-utils";

export class Logout {

    constructor() {

        if (!AuthUtil.getAuthInfo(AuthUtil.accessTokenKey) && !AuthUtil.getAuthInfo(AuthUtil.refreshTokenKey)) {
            window.location.href = '#/login';
        }


        this.logout().then();
    }

    async logout() {
        await HttpUtils.request('/logout', 'POST', false,
            {
                refreshToken: AuthUtil.getAuthInfo(AuthUtil.refreshTokenKey),
            })

        AuthUtil.removeAuthInfo();

        window.location.href = '#/login';
    }

}