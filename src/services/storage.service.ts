import { AuthRequest } from '../app/model/auth';

export class StorageService {
  private static storageKey: string = 'Fun_chat_YKaruk';

  public static saveData(userData: AuthRequest): void {
    sessionStorage.setItem(this.storageKey, JSON.stringify(userData));
  }

  public static getUserData(): AuthRequest | null {
    const data = sessionStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : null;
  }

  public static removeData(): void {
    sessionStorage.removeItem(this.storageKey);
  }
}
