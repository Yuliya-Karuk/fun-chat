import { createElementWithProperties } from '../../utils/utils';
import { BaseComponent } from '../baseComponent';
import styles from './footer.module.scss';

export class Footer extends BaseComponent {
  private githubLink: string = 'https://github.com/Yuliya-Karuk';
  private RSLink: string = 'https://github.com/rolling-scopes-school/tasks/tree/master/stage1';

  constructor() {
    super('footer', [styles.footer]);

    this.createContent();
  }

  private createContent(): void {
    const footerWrapper = createElementWithProperties('div', [styles.footerWrapper]);

    const linkGithub = createElementWithProperties('a', [styles.footerLink], { href: `${this.githubLink}` }, [
      { innerText: 'Yuliya' },
    ]);
    const githubImg = createElementWithProperties('span', [styles.footerImgGithub]);

    const year = createElementWithProperties('span', [styles.footerYear], undefined, [{ innerText: '2024' }]);

    const linkRS = createElementWithProperties('a', [styles.footerLink], {
      href: `${this.RSLink}`,
      'aria-label': 'link to RS School',
    });
    const rsImg = createElementWithProperties('span', [styles.footerImgRs]);

    linkGithub.append(githubImg);
    linkRS.append(rsImg);
    footerWrapper.append(linkGithub, year, linkRS);

    this.appendChildren([footerWrapper]);
  }
}
