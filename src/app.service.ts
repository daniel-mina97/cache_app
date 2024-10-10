import { Injectable } from '@nestjs/common';
import { Cache, LruCache, TtlCache } from './util/cache';

@Injectable()
export class AppService {
  private cache: Cache<string>;
  constructor() {
    // Ideally this would be injectded as a dependency for Nest, for the sake of simplicity just instantiating it in hte constructor
    // this.cache = new LruCache<string>();
    this.cache = new TtlCache<string>();
  }

  createCacheItem(id: string, value: string) {
    this.cache.create(id, value);
  }

  getCacheItemById(id: string) {
    return this.cache.getById(id);
  }

  getCacheItemsByValue(value: string) {
    return this.cache.searchByValue(value);
  }

  updateCacheItem(id: string, value: string) {
    this.cache.update(id, value);
  }

  deleteCacheItem(id: string) {
    this.cache.delete(id);
  }
}
