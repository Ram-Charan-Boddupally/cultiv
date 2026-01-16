
const DB_NAME = 'ArborHabitDB';
const DB_VERSION = 1;
const STORES = {
  HABITS: 'habits',
  COMPLETIONS: 'completions'
};

export class IndexedDBService {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORES.HABITS)) {
          db.createObjectStore(STORES.HABITS, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(STORES.COMPLETIONS)) {
          const completionStore = db.createObjectStore(STORES.COMPLETIONS, { keyPath: 'id' });
          completionStore.createIndex('habitId', 'habitId', { unique: false });
          completionStore.createIndex('date', 'date', { unique: false });
          completionStore.createIndex('habitIdDate', ['habitId', 'date'], { unique: true });
        }
      };

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        resolve();
      };

      request.onerror = () => reject(new Error('Failed to open IndexedDB'));
    });
  }

  private getStore(storeName: string, mode: IDBTransactionMode = 'readonly'): IDBObjectStore {
    if (!this.db) throw new Error('DB not initialized');
    const transaction = this.db.transaction(storeName, mode);
    return transaction.objectStore(storeName);
  }

  async getAllHabits(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const store = this.getStore(STORES.HABITS);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async saveHabit(habit: any): Promise<void> {
    return new Promise((resolve, reject) => {
      const store = this.getStore(STORES.HABITS, 'readwrite');
      const request = store.put(habit);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async deleteHabit(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const store = this.getStore(STORES.HABITS, 'readwrite');
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getAllCompletions(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const store = this.getStore(STORES.COMPLETIONS);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async saveCompletion(completion: any): Promise<void> {
    return new Promise((resolve, reject) => {
      const store = this.getStore(STORES.COMPLETIONS, 'readwrite');
      const request = store.put(completion);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async removeCompletion(habitId: string, date: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const store = this.getStore(STORES.COMPLETIONS, 'readwrite');
      const index = store.index('habitIdDate');
      const request = index.getKey([habitId, date]);
      request.onsuccess = () => {
        if (request.result) {
          store.delete(request.result).onsuccess = () => resolve();
        } else {
          resolve();
        }
      };
      request.onerror = () => reject(request.error);
    });
  }
}

export const dbService = new IndexedDBService();
