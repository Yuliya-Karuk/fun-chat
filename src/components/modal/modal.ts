import { createElementWithProperties } from '../../utils/utils';
import { BaseComponent } from '../baseComponent';
import styles from './modal.module.scss';

const ModalConst = {
  showModal: 'modal_active',
};

export class Modal extends BaseComponent {
  private message: HTMLParagraphElement;

  constructor() {
    super('div', [styles.modal]);

    this.renderContent();
  }

  private renderContent(): void {
    this.message = createElementWithProperties('p', [styles.modalText]);

    const container = createElementWithProperties('div', [styles.modalContent], undefined, undefined, [this.message]);

    this.appendChildren([container]);
  }

  public setErrorMessage(message: string): void {
    this.message.innerHTML = message;
  }

  public showModal(): void {
    this.node.classList.add(ModalConst.showModal);
  }

  public hideModal(): void {
    this.node.classList.remove(ModalConst.showModal);
  }
}
