import { Routes } from '../router/router.types';
import { DomElementAttribute, DomElementProperties } from '../types/interfaces';

export function isNotNullable<T>(value: T): NonNullable<T> {
  if (value === undefined || value === null) {
    throw new Error(`Not expected value`);
  }
  return value;
}

export function createElementWithProperties<K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  classNames: string[],
  attr?: DomElementAttribute,
  props?: DomElementProperties[],
  children?: (HTMLElementTagNameMap[keyof HTMLElementTagNameMap] | SVGElement)[]
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tagName);

  if (classNames.length > 0) {
    element.classList.add(...classNames);
  }

  if (attr) {
    for (let i = 0; i < Object.keys(attr).length; i += 1) {
      const key = Object.keys(attr)[i];
      element.setAttribute(key, attr[key]);
    }
  }

  if (props) {
    Object.assign(element, ...props);
  }

  if (children) {
    children.forEach(child => {
      element.append(child);
    });
  }
  return element;
}

export function checkEventTarget(value: EventTarget | null): HTMLElement {
  if (value instanceof HTMLElement) {
    return value;
  }
  throw new Error(`Not expected value`);
}

interface ConstructorOf<T> {
  new (...args: readonly never[]): T;
}

export function checkDOMElement<T extends Node>(
  elemType: ConstructorOf<T>,
  element: Element | Document | DocumentFragment
): T {
  if (!(element instanceof elemType)) {
    throw new Error(`Not expected value: ${element} of type:${elemType}`);
  }
  return element;
}

export function checkRoute(route: string): Routes {
  if (Object.values(Routes).includes(route as Routes)) {
    return route as Routes;
  }

  return Routes.Auth;
}

export function prepareDateFormat(timestamp: number): string {
  const date = new Date(timestamp);

  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');

  const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  return formattedDate;
}
