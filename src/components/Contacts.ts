import { Form } from './common/Form';
import { IEvents } from '../components/base/events';

export interface IContacts {
  email: string;
  phone: string;
}

export class Contacts extends Form<IContacts> {
  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);
  }

  get phone(): string {
    return (this.container.elements.namedItem('phone') as HTMLInputElement).value;
  }

  set phone(value: string) {
    (this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
  }

  get email(): string {
    return (this.container.elements.namedItem('email') as HTMLInputElement).value;
  }

  set email(value: string) {
    (this.container.elements.namedItem('email') as HTMLInputElement).value = value;
  }
}