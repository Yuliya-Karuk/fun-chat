import { UserAuthRequest } from '../app/model/auth';

export class StorageService {
  private static storageKey: string = 'Fun_chat_YKaruk';

  public static saveData(userData: UserAuthRequest): void {
    sessionStorage.setItem(this.storageKey, JSON.stringify(userData));
  }

  public static getUserData(): UserAuthRequest | null {
    const data = sessionStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : null;
  }

  public static isSavedUser(): boolean {
    const data = this.getUserData();
    return Boolean(data);
  }

  public static removeData(): void {
    sessionStorage.removeItem(this.storageKey);
  }
}
