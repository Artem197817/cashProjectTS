export class LocalStorageUtil {

    static CategoryKey = 'category'
    static OperationKey = 'operation'

    static setCategory(value){
        localStorage.setItem(this.CategoryKey, JSON.stringify(value));
    }
    static getCategory(){
        return JSON.parse(localStorage.getItem(this.CategoryKey));
    }

    static removeCategory(key){
        localStorage.removeItem(this.CategoryKey);
    }

    static setOperation(value){
        localStorage.setItem(this.OperationKey, JSON.stringify(value));
    }
    static getOperation(){
        return JSON.parse(localStorage.getItem(this.OperationKey));
    }

    static removeOperation(key){
        localStorage.removeItem(this.OperationKey);
    }
}