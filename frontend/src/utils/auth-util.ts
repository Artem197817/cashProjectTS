import config from "../config/config";

export class AuthUtil {
    static accessTokenKey = 'accessToken';
    static refreshTokenKey = 'refreshToken';
    static userinfoKey = 'userInfo';

    static setAuthInfo(accessToken, refreshToken, userInfo = null) {
        localStorage.setItem(this.accessTokenKey, accessToken);
        localStorage.setItem(this.refreshTokenKey, refreshToken);
        if (userInfo) {
            localStorage.setItem(this.userinfoKey, JSON.stringify(userInfo));
        }
    }

    static removeAuthInfo() {
        localStorage.removeItem(AuthUtil.accessTokenKey);
        localStorage.removeItem(AuthUtil.refreshTokenKey);
        localStorage.removeItem(AuthUtil.userinfoKey);
    }

    static getAuthInfo(key = null) {
        if (key && [this.accessTokenKey, this.refreshTokenKey, this.userinfoKey].includes(key)) {
            return localStorage.getItem(key);

        } else {
            return {
                [this.accessTokenKey]: localStorage.getItem(this.accessTokenKey),
                [this.refreshTokenKey]: localStorage.getItem(this.refreshTokenKey),
                [this.userinfoKey]: localStorage.getItem(this.userinfoKey),
            }
        }
    }

    static isRefreshing = false;

    static async updateRefreshToken() {
        if (this.isRefreshing) {
            return false;
        }

        this.isRefreshing = true;

        let result = false;
        const refreshToken = this.getAuthInfo(this.refreshTokenKey);

        if (refreshToken) {
            try {
                const response = await fetch(config.api + '/refresh', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({refreshToken: refreshToken})
                });

                if (response.ok) {
                    const newTokens = await response.json();
                    if (newTokens && !newTokens.error) {
                        this.setAuthInfo(newTokens.tokens.accessToken, newTokens.tokens.refreshToken);
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