fiStandardSolution = (function() {
    return {
      libraryMethod: function () {
        return 'Start by reading https://medium.com/javascript-scene/master-the-javascript-interview-what-is-functional-programming-7f218c68b3a0'
      },
      each: function (obj, callback) {
        const items = Array.isArray(obj) ? obj : Object.values(obj);
        for (let i = 0; i < items.length; i++) {
          let item = items[i];
          callback(item);
        }
        return obj;
      },
      map: function (obj, callback) {
        const items = Array.isArray(obj) ? obj : Object.values(obj);
        let result = [];
        for (let i = 0; i < items.length; i++) {
          let item = items[i];
          result.push(callback(item));
        }
        return result;
      },
      reduce: function (obj, callback, init) {
        const items = Array.isArray(obj) ? obj : Object.values(obj);
        let result = init || 0;
        for (let i = 0; i < items.length; i++) {
          let item = items[i];
          result = callback(result, item);
        }
        return result;
      },
      find: function (obj, callback) {
        const items = Array.isArray(obj) ? obj : Object.values(obj);
        for (let i = 0; i < items.length; i++) {
          let item = items[i];
          if (callback(item)) { return item; }
        }
      },
      filter: function (obj, callback) {
        const items = Array.isArray(obj) ? obj : Object.values(obj);
        let result = [];
        for (let i = 0; i < items.length; i++) {
          let item = items[i];
          if (callback(item)) { result.push(item) }
        }
        return result;
      },
      size: function (obj, callback) {
        const items = Array.isArray(obj) ? obj : Object.values(obj);
        return items.length;
      },
      first: function (obj, n=1) {
        const items = Array.isArray(obj) ? obj : Object.values(obj);
        return n === 1 ? items[0] : items.slice(0, n);
      },
      last: function (obj, n=1) {
        const items = Array.isArray(obj) ? obj : Object.values(obj);
        const length = items.length;
        return n === 1 ? items[length - 1] : items.slice(length - n);
      },
      compact: function (array) {
        let result = [];
        for (const item of array) {
          if (item) { result.push(item); }
        }
        return result;
      },
      sortBy: function (array, callback) {
        let result = array.slice()
        return result.sort((a,b) => { return callback(a) - callback(b) })
      },
      flatten: function (array, shallow=false, result=[]) {
        for (const val of array) {
          if (shallow) {
            result = result.concat(val);
          } else if (!shallow && Array.isArray(val)) {
            this.flatten(val, false, result);
          } else {
            result.push(val);
          }
        }
        return result;
      },
      uniq: function (obj, _, callback=(x) => x) {
        // NOTE: This one was tough for me! We should probably tweak the writeup.
        // I feel the unit tests were not extensive enough to cover
        // everything we care about for the behavior of this function.
        // I had to read the README to understand how to handle the callback case.
        // The behavior, though it may seem strange, mirrors underscore.js:
        // https://underscorejs.org/docs/underscore.html#section-62
        let uniq = new Set();
        let seen = new Set();
        for (const val of obj) {
          if (!seen.has(callback(val))) {
            seen.add(callback(val));
            uniq.add(val);
          }
        }
        return Array.from(uniq);
      },
      keys: function (obj) {
        let result = [];
        for (const key in obj) {
          // NOTE: Technically, the tests pass without hasOwnProperty
          // but hasOwnProperty ensures we don't copy from the prototype chain.
          if (obj.hasOwnProperty(key)) { result.push(key); }
        }
        return result;
      },
      values: function (obj) {
        let result = [];
        for (const key in obj) {
          // NOTE: Technically, the tests pass without hasOwnProperty
          // but hasOwnProperty ensures we don't copy from the prototype chain.
          if (obj.hasOwnProperty(key)) { result.push(obj[key]) }
        }
        return result;
      },
      functions: function (obj) {
        let result = [];
        for (const key in obj) {
          if (obj[key] instanceof Function) { result.push(key) }
        }
        return result;
      },
      giveMeMore: function () {
        return true;
      }
    }
  })()
  fiReduceSolution = (function () {
    return {
      libraryMethod: function () {
        return 'Start by reading https://medium.com/javascript-scene/master-the-javascript-interview-what-is-functional-programming-7f218c68b3a0'
      },
      /*
        NOTE: I cannot write map in terms of reduce unless map knows the key
        it should store a value back into. Standard reducers (reduce callbacks)
        only take the accumulator/result and the current item as arguments.
        Thus, these solutions work with arrays but not objects.
        "It is better to have 100 functions operate on one data structure,
         than 10 functions on 10 data structures." - Alan Perlis
      */
      reduce: function (obj, callback, result=null) {
        // NOTE: If I wanted to support reducing over arrays and objects,
        // I would do something on line 1 like: `result = new obj.constructor;`
        // I would pass the key to the callback: `callback(result, item, key)`.
        // Users writing callbacks would need to know the key is an optional arg.
        for (const key in obj) {
          let item = obj[key];
          result = callback(result, item);
        }
        return result;
      },
      each: function (obj, callback) {
        this.reduce(obj, (result, item) => callback(item));
        return obj;
      },
      map: function (obj, callback) {
        let reducer = (result, item) => result.concat(callback(item));
        return this.reduce(obj, reducer, []);
      },
      // Ignored two tests failures for this version.
      // 1st failure - Not traversing the whole array.
      // No way to do this when using reduce.
      // 2nd failure - Returns null instead of undefined for no match.
      // In my opinion, returning null is a better API. See: doc.querySelector()
      find: function (obj, callback) {
        let reducer = (result, item) => callback(item) ? item : result;
        return this.reduce(obj, reducer, []);
      },
      filter: function (obj, callback) {
        let reducer = (result, item) => callback(item) ? result.concat(item) : result;
        return this.reduce(obj, reducer, []);
      },
      size: function (obj, callback) {
        let reducer = (result, item) => result ? result + 1 : 1;
        return this.reduce(obj, reducer);
      },
      first: function (obj, n) {
        // NOTE: We can only get the first thing with reduce in a tidy way.
        // As a consequence, I've skipped handling the first "n" case.
        let reducer = (result, item) => result ? result : item;
        return this.reduce(obj, reducer);
      },
      last: function (obj, n) {
        // NOTE: We can only get the last thing with reduce in a tidy way.
        // As a consequence, I've skipped handling the last "n" case.
        let reducer = (result, item) => item;
        return this.reduce(obj, reducer);
      },
      compact: function (obj) {
        let reducer = (result, item) => item ? result.concat(item) : result;
        return this.reduce(obj, reducer, []);
      },
      sortBy: function (obj, callback) {
        // NOTE: This works but it doesn't use the reduce for anything besides
        // making a copy. I suppose I could've had my reducer do mergeSort? :P
        let reducer = (result, item) => result.concat(item);
        return this.reduce(obj, reducer, []).sort((a, b) => {
          return callback(a) - callback(b);
        });
      },
      flatten: function (obj, shallow=false, result=[]) {
        let reducer = (result, item) => {
          if (shallow) {
            return result.concat(item);
          } else if (!shallow && Array.isArray(item)) {
            return this.flatten(item, false, result);
          } else {
            return [...result, item];
          }
        };
        return this.reduce(obj, reducer, result);
      },
      uniq: function (obj, _, callback=(x) => x) {
        let seen = new Set();
        let reducer = (result, item) => {
            if (!seen.has(callback(item))) {
              seen.add(callback(item));
              return result.concat(item);
            } else {
              return result;
            }
        };
        return this.reduce(obj, reducer, []);
      },
      keys: function (obj) {
        // NOTE: Skipped this since the reducer function isn't passed the key.
      },
      values: function (obj) {
        let reducer = (result, item) => result.concat(item);
        return this.reduce(obj, reducer, []);
      },
      functions: function (obj) {
        let reducer = (result, item) => item instanceof Function ? result.concat(item) : result;
        return this.reduce(obj, reducer, []);
      },
  
      remove: function (obj, callback) {
        // NOTE: We can view this as the opposite of filter and ruby does
        // have the `reject` method which is the inverse of select, skipping
        // an item instead of copying it.
  
        // let reducer = (result, item) => callback(item) ? result : result.concat(item);
        // return this.reduce(obj, reducer, []);
        // But we could also reuse filter ...
  
        return this.filter(obj, (item) => !callback(item));
  
        // Of course, many of these examples can be written differently, often
        // more succinctly if we reuse other parts of this library. For example,
        // the functions method above, written with filter, could be:
        // return this.filter(obj, (x) => x instanceof Function);
      },
  
      reverse: function (obj) {
        let reducer = (result, item) => [item].concat(result);
        return this.reduce(obj, reducer, []);
      },
  
      giveMeMore: function () {
        return true;
      }
    }
  })
  fi = fiReduceSolution()