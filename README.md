To run the NestJS/backend app: `npm run start:dev`.

To run tests: `npm run test`.

Some general notes:
- The tests in their current state might fail, specifically for the TtlCache test case. This is due to the TtlCache making use of a setInterval timer to do its cache purging. Given more time I would have smoothed out how jest works with the timer.
- To switch between which cache the backend uses, comment/uncomment the approriate cache in the constructor method of the AppService class.
- The app should be accessible at "localhost:3000/api". You can use postman or some other Http client to test

Assumptions Made:
- A cache update should NOT perform a brand new insert to the cache if the key doesn't exist, instead it does nothing. This could further be enhanced by having the update method throw an error depending on more specific desired behavior.
- A delete of a non-existant key in the cache does nothing, but could be changed to throw an error depending on desired behavior.
- When searching caches by value, the return type is an array where each item is an object containing a value that matches and its respective key. A different behavior could be to just return the first match instead.
- The keys of the cache are case sensitive - this can be changed to be case-insensitive depending on desired behavior

Things to improve/address given more time:
- As mentioned in the above section, smoothing out how jest interacts with the timer in the TtlCache class
- Consolidating some of the common logic between the TtlCache and LruCache rather than duplicating code
- Write more test cases, especially for the TtlCache
- Implement correct value search for non-primitive types. Even though the interface allows for objects to be the value for the caches, the matching is not currently implemented to work with correctly with objects. Part of this would be refining the requirements on what a "partial" match means for an object or an array.
- Saving the cache periodically to the file system and reading the saved cache from the file system on startup.
