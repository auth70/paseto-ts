# Changelog

## 2.0.0 (2025-04-12)

- Changed `tsconfig.json` to use `esnext`

## 1.6.1 (2025-03-26)

- README update

## 1.6.0 (2025-03-26)

- Dependency updates
- Removed `typesVersions` from `package.json`

## 1.5.4 (2023-12-15)

- README update

## 1.5.3 (2023-12-15)

- Dependency updates

## 1.5.2 (2023-12-04)

- README update

## 1.5.1 (2023-09-18)

- Fix typo

## 1.5.0 (2023-09-18)

- Support objects in assertions
- Export `Assertion` type

`encrypt` and `verify` now support passing in an object as a generic type parameter. This can be used to give you type safety on the token payload:

```ts
const baz = verify<{ foo: string }>(key, token);
baz.foo; // string
```

## 1.4.4 (2023-09-17)

- Dependency updates
- Expose every file under `lib` in package.json (`import { base64UrlEncode } from 'paseto-ts/lib/base64url'`, etc.)

## 1.4.3 (2023-06-23)

- Dependency updates

## 1.4.2 (2023-06-23)

- Fix binding of Crypto to getRandomValues under node

## 1.4.1 (2023-04-27)

- Removed `globalThis` usage

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
