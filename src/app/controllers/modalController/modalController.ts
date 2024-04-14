import { Modal } from '../../../components/modal/modal';
import { eventBus } from '../../../utils/eventBus';

export class ModalController {
  public view: Modal;
  public error: string;

  constructor() {
    this.view = new Modal();

    this.bindListeners();

    eventBus.subscribe('authError', (data: string) => this.showErrorModal(data));
  }

  private bindListeners(): void {
    document.addEventListener('click', (e: Event) => this.handleClickOutsideModal(e));
  }

  private handleClickOutsideModal(e: Event): void {
    if (e.target === this.view.getNode()) {
      this.view.hideModal();
    }
  }

  public showErrorModal(message: string): void {
    this.view.setErrorMessage(message);
    this.view.showModal();
  }
}

export const modalController = new ModalController();
