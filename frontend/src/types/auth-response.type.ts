
export type ValidationError = {
    key: string;
    message: string;
}


export type AuthTokens = {
    accessToken: string;
    refreshToken: string;
}


export type User = {
    id: number;
    name: string;
    lastName: string;
    email?: string;
}


interface ErrorResponse {
    error: true;
    response: {
        error: true;
        message: string;
        validation?: ValidationError[];
    };
}

interface SuccessResponse {
    error: false;
    response: {
        tokens: AuthTokens;
        user: User;
    };
}

export type ApiResponse = ErrorResponse | SuccessResponse;

export interface RefreshResponse {
    tokens: AuthTokens;
}

