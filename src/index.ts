import './scss/styles.scss';
import { ShopAPI } from './components/ShopApi';
import { API_URL, CDN_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { AppState, CatalogChangeEvent } from './components/AppState';
import { Page } from './components/Page';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Card } from './components/Card';

const events = new EventEmitter();
const api = new ShopAPI(API_URL, CDN_URL);

// Шаблоны
const cardCatalogElm = ensureElement<HTMLTemplateElement>('#card-catalog');

// Модель данных приложения
const app = new AppState({}, events);

// Глобальные контейнеры
const pageContainer = new Page(document.body, events);

events.on<CatalogChangeEvent>('items:changed', () => {
    pageContainer.gallery = app.catalog.map(item => {
        const card = new Card(cloneTemplate(cardCatalogElm), {
            onClick: () => events.emit('card:select', item)
        });
        return card.render({
            title: item.title,
            image: item.image,
            price: item.price,
            category: item.category
        })
    })
});

function fetchProductList() {
    api.getProductList()
        .then((catalog) => {
            app.setCatalog(catalog);
        })
        .catch((err) => {
            console.log(err);
        });
}

fetchProductList();
