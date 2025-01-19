export type Category  = {
    id: number;
    title: string;
}

export type CategoriesArray = Category[];


interface ErrorResponse {
    error: true;
    response: {
        error: true;
        message: string;
    };
}


interface SuccessResponse {
    error: false;
    response: CategoriesArray;
}


export type CategoryResponse = ErrorResponse | SuccessResponse;