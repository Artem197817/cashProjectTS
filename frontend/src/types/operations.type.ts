export type Operation = {
    id: number;
    type: 'income' | 'expense';
    amount: number;
    date: string;
    comment: string;
    category: string;
}

export type OperationsArray = Operation[];

interface ErrorResponse {
    error: true;
    response: {
        error: true;
        message: string;
    };
}


interface SuccessResponse {
    error: false;
    response: OperationsArray;
}


export type OperationsResponse = ErrorResponse | SuccessResponse;