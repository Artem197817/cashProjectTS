import config from "../config/config";
import {RefreshResponse, User} from "../types/auth-response.type";
import {SimpleResponseType} from "../types/simple-response.type";

export class AuthUtil {
    public static accessTokenKey: string = 'accessToken';
    public static refreshTokenKey: string = 'refreshToken';
    public static userinfoKey: string = 'userInfo';

    public static setAuthInfo(accessToken: string, refreshToken: string, userInfo: User | null = null): void {
        localStorage.setItem(this.accessTokenKey, accessToken);
        localStorage.setItem(this.refreshTokenKey, refreshToken);
        if (userInfo) {
            localStorage.setItem(this.userinfoKey, JSON.stringify(userInfo));
        }
    }

    public static removeAuthInfo(): void {
        localStorage.removeItem(AuthUtil.accessTokenKey);
        localStorage.removeItem(AuthUtil.refreshTokenKey);
        localStorage.removeItem(AuthUtil.userinfoKey);
    }

    public static getAuthInfo(key: string | null = null): string | null {
        if (key && [this.accessTokenKey, this.refreshTokenKey, this.userinfoKey].includes(key)) {
            return localStorage.getItem(key);
        } else {
            const accessToken = localStorage.getItem(this.accessTokenKey);
            const refreshToken = localStorage.getItem(this.refreshTokenKey);
            const userinfo = localStorage.getItem(this.userinfoKey);

            return JSON.stringify({
                accessToken,
                refreshToken,
                userinfo,
            });
        }
    }

    public static isRefreshing: boolean = false;

    static async updateRefreshToken(): Promise<boolean> {
        if (this.isRefreshing) {
            return false;
        }

        this.isRefreshing = true;

        let result: boolean = false;
        const refreshToken: string | null = this.getAuthInfo(this.refreshTokenKey);

        if (refreshToken) {
            try {
                const response: Response = await fetch(config.api + '/refresh', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({refreshToken: refreshToken})
                });

                if (response.ok) {
                    const newTokens: RefreshResponse | SimpleResponseType = await response.json();
                    if (newTokens && !(newTokens as SimpleResponseType).error) {
                        this.setAuthInfo((newTokens as RefreshResponse).tokens.accessToken
                            , (newTokens as RefreshResponse).tokens.refreshToken);
                        result = true;
                    }
                } else {
                    console.error('Failed to refresh token:', response.status, response.statusText);
                }
            } catch (error) {
                console.error('Error during token refresh:', error);
            }
        }

        if (!result) {
            this.removeAuthInfo();
        }

        this.isRefreshing = false;
        return result;
    }
}