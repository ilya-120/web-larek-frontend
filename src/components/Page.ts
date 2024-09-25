import { Component } from './base/Component';
import { IEvents } from '../components/base/events';
import { ensureElement } from '../utils/utils';

export interface IPage{
  counter: number;
  gallery: HTMLElement[];
}

export class Page extends Component<IPage> {
  protected _counter: HTMLElement;
  protected _gallery: HTMLElement;
  protected _wrapper: HTMLElement;
  protected _basket: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);
    this._counter = ensureElement('.header__basket-counter');
    this._gallery = ensureElement('.gallery');
    this._wrapper = ensureElement('.page__wrapper');
    this._basket = ensureElement('.header__basket');

    this._basket.addEventListener('click', this.handleBasketClick);
  }

  private handleBasketClick = () => {
    this.events.emit('basket:open');
  };

  set counter(value: number) {
    this._counter.textContent = String(value);
  }

  set gallery(items: HTMLElement[]) {
    this._gallery.innerHTML = '';
    this._gallery.append(...items);
  }

  set locked(value: boolean) {
    this._wrapper.classList.toggle('page__wrapper_locked', value);
  }
}