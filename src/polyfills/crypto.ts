// src/polyfills/crypto.ts

if (typeof global.crypto !== 'object') {
  global.crypto = {
    getRandomValues<T extends ArrayBufferView>(array: T): T {
      for (let i = 0; i < array.byteLength; i++) {
        (array as any)[i] = Math.floor(Math.random() * 256);
      }
      return array;
    },
  } as Crypto;
}
