import { Modal } from '../../../components/modal/modal';
import { eventBus } from '../../../utils/eventBus';
import { ErrorResponse } from '../../model/error';

export class ModalController {
  public view: Modal;
  public error: string;

  constructor() {
    this.view = new Modal();

    this.bindListeners();

    eventBus.subscribe('wsError', (data: ErrorResponse) => this.showErrorModal(data.payload.error));
    eventBus.subscribe('connectionError', (data: string) => this.showErrorModal(data));
    eventBus.subscribe('reauthorizeUser', () => this.view.hideModal());
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
