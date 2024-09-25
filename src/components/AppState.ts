import { FormErrors, IAppState, IOrder, IProduct } from "../types";
import { Model } from "./base/Model";
import { IContacts } from "./Contacts";
import { IOrderDetails } from "./Order";

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

  selectProduct(item: IProduct): void {
    this.preview = item.id;
    this.emitChanges('preview:changed', item);
  }
  addProduct(item: IProduct): void {
    if (this.basket?.includes(item)) return;
    this.basket?.push(item);
    this.refreshBasket()
  }
  removeProduct(item: IProduct): void {
    if (this.basket?.includes(item)) {
      const index = this.basket.indexOf(item);
      this.basket.splice(index, 1);
    }
    this.refreshBasket()
  }

  refreshBasket(): void {
    this.emitChanges('counter:changed', this.basket);
    this.emitChanges('basket:changed', this.basket);
  }

  setOrderField(field: keyof IOrderDetails, value: string) {
    this.order[field] = value;
    if (this.validateOrder()) {
      this.events.emit('order:ready', this.order);
    }
  }

  setContactField(field: keyof IContacts, value: string) {
    this.order[field] = value;
    if (this.validateContact()) {
      this.events.emit('contact:ready', this.order);
    }
  }

  clearBasket(): void {
    this.basket = [];
    this.refreshBasket()
  }
  
  clearOrder(): void {
    this.order = {
      items: [],
      total: 0,
      address: '',
      payment: 'online',
      email: '',
      phone: '',
    };
  }

  validateContact() {
    const errors: typeof this.formErrors = {};
    if (!this.order.email) {
      errors.email = 'Необходимо указать email';
    }
    if (!this.order.phone) {
      errors.phone = 'Необходимо указать телефон';
    }
    this.formErrors = errors;
    this.events.emit('formErrors:change', this.formErrors);
    return Object.keys(errors).length === 0;
  }

  validateOrder() {
    const errors: typeof this.formErrors = {};
    if (!this.order.address) {
      errors.address = 'Необходимо указать адрес доставки'
    }
    this.formErrors = errors;
    this.events.emit('formErrors:change', this.formErrors);
    return Object.keys(errors).length === 0;
  }

  setCatalog(items: IProduct[]) {
    this.catalog = [...items];
    this.emitChanges('items:changed', { catalog: this.catalog });
  }
}