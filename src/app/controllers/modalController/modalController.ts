import { Modal } from '../../../components/modal/modal';
import { eventBus } from '../../../utils/eventBus';
import { ErrorResponse } from '../../model/error';

export class ModalController {
  public view: Modal;
  public error: string;
  private forbiddenHide: boolean = false;

  constructor() {
    this.view = new Modal();

    this.bindListeners();

    eventBus.subscribe('responseError', (data: ErrorResponse) => this.showErrorModal(data.payload.error, false));
    eventBus.subscribe('connectionError', (data: string) => this.showErrorModal(data, true));
    eventBus.subscribe('reauthorizeUser', () => this.view.hideModal());
  }

  private bindListeners(): void {
    document.addEventListener('click', (e: Event) => this.handleClickOutsideModal(e));
  }

  private handleClickOutsideModal(e: Event): void {
    if (e.target === this.view.getNode() && !this.forbiddenHide) {
      this.view.hideModal();
    }
  }

  public showErrorModal(message: string, forbiddenHide: boolean): void {
    this.forbiddenHide = forbiddenHide;
    this.view.setErrorMessage(message);
    this.view.showModal();
  }
}
