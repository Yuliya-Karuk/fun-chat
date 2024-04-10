interface EventHandler<T = unknown> {
  (...args: T[]): void;
}

class EventBus {
  private listeners: { [key: string]: EventHandler[] } = {};

  public subscribe<T>(eventType: string, handler: EventHandler<T>): void {
    if (!this.listeners[eventType]) {
      this.listeners[eventType] = [];
    }
    this.listeners[eventType].push(handler as EventHandler);
  }

  public emit(eventType: string, ...args: unknown[]): void {
    const eventListeners = this.listeners[eventType];
    if (eventListeners) {
      eventListeners.forEach(handler => handler(...args));
    }
  }
}

export const eventBus = new EventBus();
