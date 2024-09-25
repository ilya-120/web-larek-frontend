import { FormErrors, IAppState, IOrder, IProduct } from "../types";
import { Model } from "./base/Model";

export type CatalogChangeEvent = {
  catalog: Product[]
};

export class Product extends Model<IProduct> {
  id: string;
  title: string;
  category: string;
  image: string;
  price: number;
  description: string;
}

export class Order extends Model<IOrder> {
  items: string[];
  total: number;
  address: string;
  payment: string;
  email: string;
	phone: string;
}

export class AppState extends Model<IAppState> {
  catalog: IProduct[];
  selectedProduct: IProduct | null;
  order: IOrder = {
    items: [],
    total: 0,
    address: '',
    payment: 'online',
    email: '',
    phone: '',
  };
  basket: IProduct[] | null = [];
  preview: string | null;
  formErrors: FormErrors = {};

  setCatalog(items: IProduct[]) {
    this.catalog = [...items];
    this.emitChanges('items:changed', { catalog: this.catalog });
  }
}