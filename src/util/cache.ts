export interface Cache<T> {
  create(id: string, value: T): void;
  getById(id: string): T | null;
  update(id: string, value: T): void;
  searchByValue(value: Partial<T>): Array<{ id: string; value: T }>;
  delete(id: string): void;
  size: number;
}

export class LruCache<T> implements Cache<T> {
  constructor(
    private cache: { [index: string]: T } = {},
    private recordQueue: Array<string> = [],
  ) {}

  create(id: string, value: T): void {
    if (id in this.cache) {
      const indexInQueue = this.recordQueue.indexOf(id);
      this.recordQueue.splice(indexInQueue, 1);
    } else if (this.recordQueue.length === 10) {
      const idToRemove = this.recordQueue.shift();
      delete this.cache[idToRemove];
    }
    this.recordQueue.push(id);
    this.cache[id] = value;
  }

  get size() {
    return Object.keys(this.cache).length;
  }

  getById(id: string): T {
    if (id in this.cache) {
      const indexInQueue = this.recordQueue.indexOf(id);
      this.recordQueue.splice(indexInQueue, 1);
      this.recordQueue.push(id);
      return this.cache[id];
    }
    return null;
  }

  update(id: string, value: T): void {
    if (this.cache[id] === undefined) return;
    this.create(id, value);
  }

  searchByValue(searchValue: T | Partial<T>): Array<{ id: string; value: T }> {
    const results: Array<{ id: string; value: T }> = [];
    Object.entries(this.cache).forEach(([key, value]) => {
      if (
        typeof value === 'string' &&
        typeof searchValue === 'string' &&
        value.toLowerCase().includes(searchValue.toLowerCase())
      ) {
        results.push({ id: key, value: value });
      } else if (searchValue === value) {
        // TODO: This currently just accounts for other non-string primitive types. Different logic will have to be implemented to do "partial" matching on objects.
        results.push({ id: key, value: value });
      }
    });
    results.forEach((result) => {
      const indexInQueue = this.recordQueue.indexOf(result.id);
      this.recordQueue.splice(indexInQueue, 1);
      this.recordQueue.push(result.id);
    });
    return results;
  }

  delete(id: string) {
    if (id in this.cache) {
      const indexInQueue = this.recordQueue.indexOf(id);
      this.recordQueue.splice(indexInQueue, 1);
      delete this.cache[id];
    }
  }
}

export class TtlCache<T> implements Cache<T> {
  private CACHE_PURGE_INTERVAL_MS: number;

  constructor(
    purgeInterval?: number,
    private cache: { [index: string]: T } = {},
    private lastUsedMap: { [index: string]: Date } = {},
  ) {
    this.CACHE_PURGE_INTERVAL_MS = purgeInterval || 10000;
    setInterval(() => {
      const purgeCutoff = new Date(
        new Date().getTime() - this.CACHE_PURGE_INTERVAL_MS,
      );
      const ids = Object.keys(this.cache);
      ids.forEach((id) => {
        if (lastUsedMap[id] < purgeCutoff) {
          delete this.cache[id];
          delete this.lastUsedMap[id];
        }
      });
    }, this.CACHE_PURGE_INTERVAL_MS);
  }

  get size() {
    return Object.keys(this.cache).length;
  }

  create(id: string, value: T): void {
    this.cache[id] = value;
    this.lastUsedMap[id] = new Date();
  }

  getById(id: string) {
    if (id in this.cache) {
      this.lastUsedMap[id] = new Date();
      return this.cache[id];
    }
    return null;
  }

  update(id: string, value: T): void {
    if (this.cache[id] === undefined) return;
    this.create(id, value);
  }

  searchByValue(searchValue: T | Partial<T>): Array<{ id: string; value: T }> {
    const now = new Date();
    const results: Array<{ id: string; value: T }> = [];
    Object.entries(this.cache).forEach(([key, value]) => {
      if (
        typeof value === 'string' &&
        typeof searchValue === 'string' &&
        value.toLowerCase().includes(searchValue.toLowerCase())
      ) {
        results.push({ id: key, value: value });
        this.lastUsedMap[key] = now;
      } else if (searchValue === value) {
        // TODO: This currently just accounts for other non-string primitive types. Different logic will have to be implemented to do "partial" matching on objects.
        results.push({ id: key, value: value });
        this.lastUsedMap[key] = now;
      }
    });
    return results;
  }

  delete(id: string) {
    if (id in this.cache) {
      delete this.cache[id];
      delete this.lastUsedMap[id];
    }
  }
}
