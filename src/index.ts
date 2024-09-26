import './scss/styles.scss';
import { ShopAPI } from './components/ShopApi';
import { API_URL, CDN_URL, eventsSelectors } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { AppState, CatalogChangeEvent, Product } from './components/AppState';
import { Page } from './components/Page';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Card } from './components/Card';
import { Modal } from './components/common/Modal';
import { IOrder } from './types';
import { Basket } from './components/common/Basket';
import { IOrderDetails, Order } from './components/Order';
import { IContacts, Contacts } from './components/Contacts';
import { Success } from './components/common/Success';

const PaymentMethod: { [key: string]: string } = {
    card: 'online',
    cash: 'cash',
};

const events = new EventEmitter();
const api = new ShopAPI(API_URL, CDN_URL);

// Чтобы мониторить все события, для отладки
events.onAll(({ eventName, data }) => {
    console.log(eventName, data);
});

// Шаблоны
const cardCatalogElm = ensureElement<HTMLTemplateElement>('#card-catalog');
const contactsElm = ensureElement<HTMLTemplateElement>('#contacts');
const successElm = ensureElement<HTMLTemplateElement>('#success');
const cardPreviewElm = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketElm = ensureElement<HTMLTemplateElement>('#card-basket');
const basketElm = ensureElement<HTMLTemplateElement>('#basket');
const orderElm = ensureElement<HTMLTemplateElement>('#order');

// Модель данных приложения
const app = new AppState({}, events);

// Глобальные контейнеры
const pageContainer = new Page(document.body, events);
const modalContainer = new Modal(
    ensureElement<HTMLElement>('#modal-container'),
    events
);
const success = new Success(cloneTemplate(successElm), {
    onClick: () => {
        modalContainer.close();
    },
});

const basket = new Basket(cloneTemplate(basketElm), events);
const order = new Order(cloneTemplate(orderElm), events, {
    onClick: (ev: Event) => events.emit(eventsSelectors.paymentToggle, ev.target),
});
const contact = new Contacts(cloneTemplate(contactsElm), events);

const handleModalOpen = () => {
    pageContainer.locked = true;
};

const handleModalClose = () => {
    pageContainer.locked = false;
};

const handleCardSelect = (item: Product) => {
    app.selectProduct(item);
};

const handleOrderSubmit = () => {
    api
        .createOrder(app.order)
        .then((result) => {
            app.clearBasket();
            app.clearOrder();

            success.description = result.total.toString();

            modalContainer.render({
                content: success.render({}),
            });
        })
        .catch((err) => {
            console.error(err);
        });
};

const handlePreviewChanged = (item: Product) => {
    const card = new Card(cloneTemplate(cardPreviewElm), {
        onClick: () => {
            events.emit(eventsSelectors.productToggle, item);
            card.buttonText =
                app.basket.indexOf(item) < 0 ? 'Купить' : 'Удалить из корзины';
        },
    });
    const buttonText =
        app.basket.indexOf(item) < 0 ? 'Купить' : 'Удалить из корзины';
    card.buttonText = buttonText;
    modalContainer.render({
        content: card.render({
            title: item.title,
            description: item.description,
            image: item.image,
            price: item.price,
            category: item.category,
            buttonTitle: buttonText,
        }),
    });
};

events.on<CatalogChangeEvent>('items:changed', () => {
    pageContainer.gallery = app.catalog.map((item) => {
        const card = new Card(cloneTemplate(cardCatalogElm), {
            onClick: () => events.emit(eventsSelectors.cardSelect, item),
        });
        return card.render({
            title: item.title,
            image: item.image,
            price: item.price,
            category: item.category,
        });
    });
});

// Отправлена форма заказа
events.on(eventsSelectors.orderSubmit, () => {
    modalContainer.render({
        content: contact.render({
            email: '',
            phone: '',
            valid: false,
            errors: [],
        }),
    });
});

// Изменилось состояние валидации формы
events.on(eventsSelectors.formErrorsChange, (errors: Partial<IOrder>) => {
    const { payment, address, email, phone } = errors;
    order.valid = !payment && !address;
    contact.valid = !email && !phone;
    order.errors = Object.values({ payment, address })
        .filter((i) => !!i)
        .join('; ');
    contact.errors = Object.values({ phone, email })
        .filter((i) => !!i)
        .join('; ');
});

// Изменилось одно из полей
events.on(
    /^order\..*:change/,
    (data: { field: keyof IOrderDetails; value: string }) => {
        app.setOrderField(data.field, data.value);
    }
);

// Изменилось одно из полей
events.on(
    /^contacts\..*:change/,
    (data: { field: keyof IContacts; value: string }) => {
        app.setContactField(data.field, data.value);
    }
);

// Открытие карточки
events.on(eventsSelectors.cardSelect, handleCardSelect);

// Просмотр продукта
events.on(eventsSelectors.previewChanged, handlePreviewChanged);

// Открытие модального окна
events.on(eventsSelectors.modalOpen, handleModalOpen);

// Закрытие модального окна
events.on(eventsSelectors.modalClose, handleModalClose);

// Добавление товара
events.on(eventsSelectors.productAdd, (item: Product) => {
    app.addProduct(item);
});

// Удаление товара
events.on(eventsSelectors.productDelete, (item: Product) => {
    app.removeProduct(item);
});

// Переключение добавить удалить товар
events.on(eventsSelectors.productToggle, (item: Product) => {
    if (app.basket.indexOf(item) < 0) {
        events.emit(eventsSelectors.productAdd, item);
    } else {
        events.emit(eventsSelectors.productDelete, item);
    }
});

// Обновление интерфейса корзины
events.on(eventsSelectors.basketChanged, (items: Product[]) => {
    basket.items = items.map((item, index) => {
        const card = new Card(cloneTemplate(cardBasketElm), {
            onClick: () => {
                events.emit(eventsSelectors.productDelete, item);
            },
        });
        return card.render({
            index: (index + 1).toString(),
            title: item.title,
            price: item.price,
        });
    });

    const total = items.reduce((total, item) => total + item.price, 0);
    basket.total = total;
    app.order.total = total;
    basket.toggleButton(total === 0);
});

// Обновление счетика корзины
events.on(eventsSelectors.counterChanged, () => {
    pageContainer.counter = app.basket.length;
});

// Открытие корзины
events.on(eventsSelectors.basketOpen, () => {
    modalContainer.render({
        content: basket.render({}),
    });
});

// Открытие формы заказа
events.on(eventsSelectors.orderOpen, () => {
    modalContainer.render({
        content: order.render({
            payment: '',
            address: '',
            valid: false,
            errors: [],
        }),
    });
    app.order.items = app.basket.map((item) => item.id);
});

// Смена способа оплаты
events.on(eventsSelectors.paymentToggle, (target: HTMLElement) => {
    if (!target.classList.contains('button_alt-active')) {
        order.toggleButtons(target);
        app.order.payment = PaymentMethod[target.getAttribute('name')];
    }
});

// Валидность формы оплаты
events.on(eventsSelectors.orderReady, () => {
    order.valid = true;
});

// Валидность формы контактов
events.on(eventsSelectors.contactReady, () => {
    contact.valid = true;
});

// Подтверджение формы контактов
events.on(eventsSelectors.contactsSubmit, handleOrderSubmit);

function fetchProductList() {
    api
        .getProductList()
        .then((catalog) => {
            app.setCatalog(catalog);
        })
        .catch(console.error);
}

fetchProductList();
