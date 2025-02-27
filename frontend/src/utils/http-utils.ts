import config from "../config/config";
import {AuthUtil} from "./auth-util";


export class HttpUtils {
    static async request(url: string, method: string = 'GET', useAuth: boolean = true, body: any = null): Promise<any> {
        const result: any = {
            error: false,
            response: null,
        }
        const params: any = {
            method: method,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        }

        let token: string | null = null;
        if (useAuth) {
            token = AuthUtil.getAuthInfo(AuthUtil.accessTokenKey);
            if (token) {
                params.headers['x-auth-token'] = token;
            }
        }

        if (body) {
            params.body = JSON.stringify(body);
        }

        let response: Response | null  = null;
        try {
            response = await fetch(config.api + url, params);
            result.response = await response.json();
        } catch (err) {
            result.error = true;
            return result;
        }
        if (!response.ok) {
            result.error = true;
            if (useAuth && response.status === 401) {
                if (!token) {
                    return location.href = '#/login'
                } else {
                    const updateTokenResult = await AuthUtil.updateRefreshToken();
                    if (updateTokenResult) {
                        return this.request(url, method, useAuth, body);
                    } else {
                        return location.href = '#/login'
                    }
                }
            }
        }
        return result;
    }
}