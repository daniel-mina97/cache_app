import { LruCache, TtlCache } from '../src/util/cache';

describe('cache.ts', () => {
  afterAll((done) => {
    done();
  });

  describe('LruCache', () => {
    it('should properly insert values into the cache, accounting for last recently used and the maximum size', () => {
      const cache = new LruCache<string>();
      cache.create('a', 'apple');
      expect(cache.size).toBe(1);
      expect(cache.getById('a')).toBe('apple');

      const itemsToInsert = [
        { key: 'b', value: 'banana' },
        { key: 'c', value: 'cake' },
        { key: 'd', value: 'dumpster' },
        { key: 'e', value: 'elephant' },
        { key: 'f', value: 'frog' },
        { key: 'g', value: 'grape' },
        { key: 'h', value: 'hero' },
        { key: 'i', value: 'igloo' },
        { key: 'j', value: 'jack' },
        { key: 'k', value: 'kangaroo' },
      ];

      itemsToInsert.forEach((item) => {
        cache.create(item.key, item.value);
      });

      expect(cache.size).toBe(10);
      expect(cache.getById('a')).toBeNull();

      cache.update('b', 'bongo');
      cache.create('c', 'car');
      cache.create('l', 'loser');
      expect(cache.size).toBe(10);
      expect(cache.getById('b')).toBe('bongo');
      expect(cache.getById('c')).toBe('car');
      expect(cache.getById('l')).toBe('loser');
      expect(cache.getById('d')).toBeNull();
    });

    it('should do nothing to the cache if attempting to update a key that does not exist', () => {
      const cache = new LruCache<string>();
      cache.update('a', 'apple');
      expect(cache.size).toBe(0);
      expect(cache.getById('a')).toBeNull();
    });

    it('should replace an existing cache item when update is called', () => {
      const cache = new LruCache<string>();
      cache.create('a', 'apple');
      expect(cache.size).toBe(1);
      expect(cache.getById('a')).toBe('apple');

      cache.update('a', 'abcd');
      expect(cache.size).toBe(1);
      expect(cache.getById('a')).toBe('abcd');
    });

    it('should return the value stored in the cache if it exists, or null if it does not exist', () => {
      const cache = new LruCache<string>();
      cache.create('a', 'apple');

      expect(cache.getById('a')).toBe('apple');
      expect(cache.getById('b')).toBeNull();
    });

    it('should properly delete a cache item', () => {
      const cache = new LruCache<string>();
      cache.create('a', 'apple');
      expect(cache.size).toBe(1);
      expect(cache.getById('a')).toBe('apple');

      cache.delete('a');
      expect(cache.size).toBe(0);
      expect(cache.getById('a')).toBeNull();
    });

    it('should be able to find all matching, case-insensitive substrings that exist in the cache by value', () => {
      const cache = new LruCache<string>();
      cache.create('a', 'apple');
      cache.create('p', 'Please');
      cache.create('b', 'bloom');

      expect(cache.searchByValue('pl')).toEqual([
        {
          id: 'a',
          value: 'apple',
        },
        {
          id: 'p',
          value: 'Please',
        },
      ]);
    });
  });

  describe('TtlCache', () => {
    it('should properly clear out the cache of items that have not been used in the set interval', async () => {
      const cache = new TtlCache<string>(1000);
      cache.create('a', 'apple');
      cache.create('b', 'bee');
      expect(cache.size).toBe(2);
      expect(cache.getById('a')).toBe('apple');
      expect(cache.getById('b')).toBe('bee');
      await new Promise((resolve) => {
        setTimeout(resolve, 500);
      });
      expect(cache.size).toBe(2);
      cache.getById('a');
      await new Promise((resolve) => {
        setTimeout(resolve, 1000);
      });
      expect(cache.size).toBe(1);
      expect(cache.getById('b')).toBeNull();
      await new Promise((resolve) => {
        setTimeout(resolve, 1000);
      });
      expect(cache.size).toBe(0);
      expect(cache.getById('a')).toBeNull();
      expect(cache.getById('b')).toBeNull();
    });
  });
});
