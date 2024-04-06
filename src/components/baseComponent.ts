import { DomElementAttribute, DomElementProperties } from '../types/interfaces';

export class BaseComponent<T extends HTMLElement = HTMLElement> {
  protected node: T;

  constructor(
    tagName: keyof HTMLElementTagNameMap,
    classNames: string[] = [],
    attr?: DomElementAttribute,
    props?: DomElementProperties[],
    children: HTMLElementTagNameMap[keyof HTMLElementTagNameMap][] = []
  ) {
    this.node = document.createElement(tagName) as T;

    if (classNames.length > 0) {
      this.node.classList.add(...classNames);
    }

    if (attr) {
      this.setAttributes(attr);
    }

    if (props) {
      Object.assign(this.node, ...props);
    }

    if (children) {
      this.appendChildren(children);
    }
  }

  public appendChildren(children: HTMLElementTagNameMap[keyof HTMLElementTagNameMap][]): void {
    children.forEach(child => {
      this.node.append(child);
    });
  }

  public getNode(): T {
    return this.node;
  }

  public setAttributes(attr: DomElementAttribute): void {
    for (let i = 0; i < Object.keys(attr).length; i += 1) {
      const key = Object.keys(attr)[i];
      this.node.setAttribute(key, attr[key]);
    }
  }

  public setAttribute(attribute: string, value: string): void {
    this.node.setAttribute(attribute, value);
  }

  public removeAttribute(attribute: string): void {
    this.node.removeAttribute(attribute);
  }

  public toggleClass(className: string): void {
    this.node.classList.toggle(className);
  }

  public destroyChildren(): void {
    this.node.replaceChildren();
  }

  public destroy(): void {
    this.destroyChildren();
    this.node.remove();
  }
}
