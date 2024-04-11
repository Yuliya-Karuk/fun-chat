import { AppImage } from '../../components/appImageBlock/appImage';
import { BaseComponent } from '../../components/baseComponent';
import { Footer } from '../../components/footer/footer';
import { Header } from '../../components/header/header';
import { Main } from '../../components/main/main';
import { PagesNames } from '../../types/enums';
import { AboutParagraphs } from '../../utils/constants';
import { createElementWithProperties } from '../../utils/utils';
import styles from './about.module.scss';

export class AboutView extends BaseComponent {
  public header: Header = new Header(PagesNames.About);
  private footer: Footer = new Footer();
  private main: Main = new Main();
  private appImage: AppImage = new AppImage();

  constructor() {
    super('div', [styles.about]);
  }

  public renderContent(): void {
    const info = createElementWithProperties('div', [styles.aboutContent]);
    Object.values(AboutParagraphs).forEach(p => {
      const newP = createElementWithProperties('div', [styles.aboutText], undefined, [{ innerText: p }]);
      info.append(newP);
    });

    this.main.appendChildren([this.appImage.getNode(), info]);
    this.appendChildren([this.header.getNode(), this.main.getNode(), this.footer.getNode()]);
  }

  public setHeaderLinks(isLoginedUser: boolean): void {
    this.header.setLinks(isLoginedUser);
  }
}
