# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/styles/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Описание проекта

Проект "Веб-ларек" - интернет-магазин с товарами для веб-разработчиков. Пользователь может каталог товаров, добавить товары в корзину и делать заказы.. Проект реализован на TypeScript и представляет собой SPA (Single Page Application) с использованием API для получения данных о товарах и заказах.

## Описание интерфейса

Интерфейс можно условно разделить на 3 процесса:
1. Просмотр списка товаров.
2. Выбор товара и добавление в корзину.
3. Оформление заказа.

## Описание архитектуры проекта

Код приложения разделен на слои согласно парадигме MVP:

слой представления - View, отвечает за отображение данных на странице.
слой данных - Model, отвечает за хранение и изменение данных.
презентер - Presenter, отвечает за связь представления и данных.

### Базовый код

#### Класс Api
Содержит в себе базовую логику отправки запросов. В конструктор передается адрес сервера и опциональный объект с заголовками запросов.
Методы:
- `get` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер.
- `post` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется POST запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.

#### Класс EventEmitter
Обеспечивает работу событий. Его функции: возможность установить и снять слушателей событий, вызвать слушателей при возникновении события.
Основные методы, реализуемые классом описаны интерфейсом IEvents:
- `on` - подписка на событие.
- `emit` - инициализация события.
- `trigger` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие.

#### Класс Component
Абстрактный класс, служит в качестве базового компонента для работы с DOM.
- `toggleClass` - переключает класс стилей;
- `setText` - установливает текстовое поле;
- `setDisabled` - меняет статус блокировки истина/ложь;
- `setVisible` - меняет статус видимости элемента истина/ложь;
- `setImage` - добавляет изображение;
- `render` - возвращает корневой DOM-элемент.

### Слой данных

#### Класс AppState
Класс отвечает за управление состоянием каталога продуктов, корзины, заказа и ошибки форм.
Класс хранит такие данные, как:
- массив товаров
- выбранный товар 
- корзина с добавленными товарами
- экземпляр класса EventEmitter для инициации событий при изменении данных.
Так же класс обладает набором методов:
- `setCatalog` - метод, который устанавливает каталог продуктов.
- `selectProduct` - отвечает за изменение открываемого в модальном окне товара.
- `addProduct` - добавляет товар в корзину.
- `removeProduct` - удаляет товар из корзины.
- `clearBasket` - отвечает за очистку корзины.
- `clearOrder` - очищает данные заказа.
- `refreshBasket` - обновление корзины.
- `setOrderAdd` - добавление данных из формы заказа.
- `setContactAdd` - добавление данных из формы контактов.
- `getBasketTotal` - считает количество товаров в корзине.
- `validateOrder` - валидация данных в заказе.
- `postOrderProduct` - отвечает за отправку заказа на сервер.

### Слой представления

#### Класс Page
Класс главного экрана приложения (наследуемый от Component).
Методы:
- `setCatalog` - устанавливает содержимое каталога товаров.
- `setCounter` - устанавливает значение счетчика товаров в корзине.
- `setLocked` - блокирует интерфейс страницы при открытии модального окна.

#### Класс Card
Этот класс реализует карточку товара (наследуемый от Component).
Класс хранит такие данные, как:
- категория товара
- изображение товара
- цена товара;

#### Класс Modal
Этот класс реализует модальное окно (наследуемый от Component).
Методы:
- `setContent` - отвечает за содержимое модального окна.
- `openModal` - открытие модального окна.
- `closeModal` - закрытие модального окна.

#### Класс Basket
Этот класс реализует корзину товаров (наследуемый от Component).
Методы:
- `toggleButton` - меняет статус блокировки истина/ложь;

#### Класс Form
Этот класс управляет состоянием формы, обработкой полей ввода, ошибок и отправки на сервер (наследуемый от Component).
Методы:
- `onChange` - обрабатывает изменения ввода в форме и генерирует событие с информацией о поле и его новом значении.
- `setValid` - изменяет состояние кнопки Далее при шагах заказа.
- `onValid` - отвечает за активацию кнопки отправки заказа.
- `error` - выводит текст ошибки.

#### Класс Order
Этот класс реализует форму заказа с выбором способа оплаты и адреса доставки (наследуемый от Form).
Методы:
- `setAddress` - отвечает за значение адреса доставки.
- `togglePayment` - переключает активное состояние кнопок выбора способа оплаты.


#### Класс Contacts
Этот класс реализует форму для ввода контактной информации (наследуемый от Form).

#### Класс Success
Этот класс выводит сообщения об успешном выполнении заказа (наследуемый от Component).

### Презентер События, возникающие при взаимодействии пользователя с интерфейсом.

- items:changed - обновление списка продуктов
- modal:openModal - открытие модального окна
- modal:closeModal - закрытие модального окна
- product:add - добавление товара в корзину
- product:delete - удаление товара из корзины
- basket:changed - обновление интерфейса корзины
- counter:changed - обновление счетика корзины
- order:changed - изменения в заказе
- address:change - изменение адреса
- contacts:change - изменение контактов
- error:changed - ошибка формы
- order:submit - подтверджение формы оплаты
- contacts:submit - подтверджение формы контактов
- payment:toggle - смена способа оплаты
