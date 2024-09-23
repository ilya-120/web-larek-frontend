export interface IProduct {
    id: string;
    title: string;
    description: string;
    category: string;
    price: number;
    image: string;
}

export interface IOrder {
    items: string[];
    total: number;
    email: string;
    phone: string;
    address: string;
    payment: string;
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export interface IOrderSuccess {
    id: string;
    total: number;
}

export interface IOrderResult extends IOrder {
    id: string;
    errors?: string;
}

export interface IShopAPI {
    getProductList: () => Promise<IProduct[]>;
    getProduct: (id: string) => Promise<IProduct>;
    createOrder: (order: IOrder) => Promise<IOrderSuccess>;
}

export interface IAppState {
    catalog: IProduct[];
    selectedProduct: IProduct | null;
    order: IOrder | null;
    basket: string[] | null;
    preview: string | null;
    formErrors: FormErrors;

    // API
    setCatalog(): Promise<IProduct[]>;
    orderProduct(): Promise<IOrderSuccess>;

    // Дополнительные методы
    clearBasket(): void;
    clearOrder(): void;
    validateOrder(data: FormErrors): boolean;

    // Действия пользователя
    selectProduct(id: string): void;
    addProduct(id: string): void;
    removeProduct(id: string): void;

}
