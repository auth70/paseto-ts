# Changelog

## 1.4.0 (2023-02-22)

- Changed `encrypt` function: accepts `getRandomValues` option for Node < 19.
- Changed `generateKeys` function: accepts `getRandomValues` option for Node < 19.

A `getRandomValues` function is required as an option for Node < 19.0.0. It should be a function that accepts a `Uint8Array` and returns a `Uint8Array` with random values:

```ts
const getRandomValues = (array: Uint8Array): Uint8Array => {
    const bytes = crypto.randomBytes(array.length);
    array.set(bytes);
    return array;
};
```

## 1.3.0 (2023-01-26)

- Refactored imports to use `.js` extension.

## 1.2.0 (2023-01-26)

- `encrypt` accepts a `Payload` object instead of string and Uint8Array.

## 1.1.0 (2023-01-24)

- Added option to disable payload validation (`validatePayload: false`).
- Uint8Array footers are now validated against `maxKeys` and `maxDepth`.
- Added passing V4 test vectors.

## 1.0.0 (2023-01-16)

- Initial release
