import {Category} from "../types/category.type";
import {Operation} from "../types/operations.type";

export class LocalStorageUtil {

   public static CategoryKey:string = 'category'
    public static OperationKey:string = 'operation'

   public static setCategory(value: Category): void{
        localStorage.setItem(this.CategoryKey, JSON.stringify(value));
    }
   public static getCategory(): Category | null {
       const category: string | null = localStorage.getItem(this.CategoryKey);
    if(category) {
        return JSON.parse(category);
    }
    return null;
   }

   public static removeCategory(): void{
        localStorage.removeItem(this.CategoryKey);
    }

    public static setOperation(value: Operation): void{
        localStorage.setItem(this.OperationKey, JSON.stringify(value));
    }
    public static getOperation(): Operation | null{

       const operation: string | null = localStorage.getItem(this.OperationKey);
       if(operation) {
           return JSON.parse(operation);
       }
        return null;
    }

    public static removeOperation(): void{
        localStorage.removeItem(this.OperationKey);
    }
}