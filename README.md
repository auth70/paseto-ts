<p align="center">
  <a href="https://github.com/auth70/paseto-ts/actions"><img src="https://img.shields.io/github/actions/workflow/status/auth70/paseto-ts/ci.yml?logo=github" alt="build"></a>
  <a href="https://www.npmjs.com/package/paseto-ts"><img src="https://img.shields.io/npm/v/paseto-ts" alt="npm"></a>
  <a href="https://www.npmjs.com/package/paseto-ts"><img src="https://img.shields.io/npm/types/paseto-ts" alt="npm type definitions"></a>
</p>

# paseto-ts

[PASETO](https://paseto.io) v4 implementation written in TypeScript. Does not require Node.js.

The code is well-documented and has 100% unit test coverage ensuring it conforms with the best practices laid out in the PASETO implementation guide.

If you are unfamiliar with PASETO, please see Okta's blog post ["A Thorough Introduction to PASETO"](https://developer.okta.com/blog/2019/10/17/a-thorough-introduction-to-paseto).

The only dependencies are the Blake2b, Ed25519 and XChaCha20 cryptographic primitives, which do not yet exist in the standard Web Crypto API, provided by [stablelib](https://www.stablelib.com). If you wish to use other primitives, feel free to fork the project and implement them; it should be straightforward.

## Installation

```bash
npm install --save paseto-ts
```

**This library is an ES Module!**

**Remember:** You need to put `"type": "module"` in your package.json to enable ESM in Node! If you are getting an export error, this is probably why.

## Supported PASETO versions

Version     | Purpose
------------|------------------------------------------------
`v4.public` | Public-key signatures (`sign` and `verify`)
`v4.local`  | Symmetric encryption (`encrypt` and `decrypt`)

### Key formats

This library implements the `k4.local`, `k4.public` and `k4.secret` [PASERK](https://github.com/paseto-standard/paserk) compatible key formats. It does not accept arbitrary key data that is not scoped to a specific purpose. It also does not implement key wrapping or other PASERK features.

## Usage

The package will not work in commonjs environments without a transpilation step. It has been tested in Node > 16 and modern browsers. As it depends on the Web Crypto API being available, Deno and Bun should work, but are not tested.

<details>
<summary><b>Note on Node versions under 19</b></summary>
If you encounter the error `crypto is not defined` using the `generateKeys` and `encrypt` functions, you need to pass an implementation of the `getRandomValues` function as an option. This is because Node versions under 19 do not have a global `crypto` object.

```ts
import * as crypto from 'node:crypto';
import { generateKeys } from 'paseto-ts/v4';

const getRandomValues = (array: Uint8Array): Uint8Array => {
    const bytes = crypto.randomBytes(array.length);
    array.set(bytes);
    return array;
};

generateKeys('local', { format: 'paserk', getRandomValues });
```
</details>

### Setting token expiry, issued at and not-before times

When using the `encrypt` and `sign` functions, the `iat` *(issued at)* and `exp` *(expires at)* claims are added to your payload if they do not exist. By default, the `exp` claim will be set one hour in the future.

You can disable this behaviour by passing `addIat: false` and/or `addExp: false` as options to create tokens that do not expire.

**You can provide an `exp` and `nbf` *(not before)* claim as a relative time**, e.g. `exp: "1 hour"` or `nbf: "1 day"`. The `iat` claim only accepts string-formatted ISO dates (e.g. `iat: "2023-01-01T00:00:00Z"`).

Registered claims will be validated against the spec. To disable this behaviour, pass `validatePayload: false` as an option.

### JSON validation

This library conforms to the best practices laid out in the PASETO implementation guide regarding JSON parsing. It will throw an error if the payload or footer is not valid JSON, if the JSON is too deep or has too many keys. You can disable this behaviour by passing `maxDepth: 0` and/or `maxKeys: 0` to the options object.

## Local (encryption and decryption)

**You use the same key to encrypt and decrypt your message.**

The PASETO spec requires local and public keys to be separated. Therefore, to use the `encrypt` and `decrypt` functions in this library, `k4.local.` **must** be prepended to the key data to prevent accidental key sharing between local and public functions. Please refer to the table below:

### Local key format

Type         | Expected format                                                  | Length
-------------|------------------------------------------------------------------|------------------
`PASERK`     | `k4.local.[key data as base64url]`                               | 52 characters
`Uint8Array` | `[0x6b, 0x34, 0x2e, 0x6c, 0x6f, 0x63, 0x61, 0x6c, 0x2e, ...key]` | 41 bytes

There is no functional difference between the two formats; if you are passing the key in from an environment variable, you may prefer to use `PASERK` format. If you are generating the key elsewhere, you may prefer to use `Uint8Array` and prepend the magic bytes yourself.

#### Generate a local key

You can generate a local key in PASERK format using the `generateKeys` function:

```ts
import { generateKeys } from 'paseto-ts/v4';

const localKey = generateKeys('local');
// localKey: k4.local.xxx..
```

If you need the key as a buffer, you can pass in `buffer` as the second argument:

```ts
import { generateKeys } from 'paseto-ts/v4';

const localKeyBuffer = generateKeys('local', { format: 'buffer' });
// localKeyBuffer: Uint8Array(41)
```

### Encrypt a payload

```ts
import { encrypt } from 'paseto-ts/v4';

try {

    const token = await encrypt(
        // localKey = k4.local.xxx..
        localKey, // string | Uint8Array
        // payload = { sub: '1234567890', name: 'John Doe' }
        payload, // Payload | string | Uint8Array
        {
            // Optional: If footer parses to an object, its `kid` and `wpk` claims will be validated.
            footer, // Footer | string | Uint8Array
            // Optional: Assertion is a JSON.stringifyable object, string or buffer.
            assertion, // Assertion | string | Uint8Array
            // Optional: If true, a default `exp` claim of 1 hour will be added to the payload.
            addExp, // boolean; defaults to true
            // Optional: If true, a default `iat` claim of the current time will be added to the payload.
            addIat, // boolean; defaults to true
            // Optional: Maximum depth of the JSON in the payload and footer objects (if footer parses to an object)
            maxDepth, // number; defaults to 32. 0 to disable
            // Optional: Maximum number of keys in the payload and footer objects (if footer parses to an object)
            maxKeys, // number; defaults to 128. 0 to disable
            // Optional: If true, the payload will be validated against the registered claims.
            validatePayload, // boolean; defaults to true
            // Optional: crypto.getRandomValues implementation (for Node < 19)
            getRandomValues, // (array: Uint8Array) => Uint8Array
        }
    );

    // token: v4.local.xxx..

} catch(err) {
    // err: Error
}
```

### Decrypt a token

```ts
import { decrypt } from 'paseto-ts/v4';

try {

    // generic type parameter is optional but will give you type safety on the payload
    const { payload, footer } = await decrypt<{ foo: string }>( 
        // localKey = k4.local.xxx..
        localKey, // string | Uint8Array
        // token = v4.local.xxx..
        token, // string | Uint8Array
        {
            // Optional: Assertion is a JSON.stringifyable object, string or buffer.
            assertion, // Assertion | string | Uint8Array
            // Optional: Maximum depth of the JSON in the payload and footer objects (if footer parses to an object)
            maxDepth, // number; defaults to 32. 0 to disable
            // Optional: Maximum number of keys in the payload and footer objects (if footer parses to an object)
            maxKeys, // number; defaults to 128. 0 to disable
            // Optional: If true, the payload will be validated against the registered claims.
            validatePayload, // boolean; defaults to true
        }
    );

    // payload: { sub: '1234567890', name: 'John Doe', iat: "2023-01-01T00:00:00.000Z", foo: 'bar' }
    // footer: { kid: 'xxx..', wpk: 'xxx..' }

} catch(err) {
    // err: Error
}
```

## Public (signing and verification)

**You use a secret key to sign your payload, and a public key to verify the generated token.**

The PASETO spec dictates that you use Ed25519 keys, which are 64 bytes long. To use the `sign` and `verify` functions in this library, `k4.public.` **must** be prepended to the public key data and `k4.secret.` **must** be prepended to the secret key data to prevent accidental key sharing between local and public functions. Please refer to the table below:

### Secret key format

Type | Expected format | Length
-------------|------------------------------------------------------------------|-----------------
`PASERK`     | `k4.secret.[key data as base64url]`                              | 96 characters
`Uint8Array` | `[0x6b, 0x34, 0x2e, 0x73, 0x65, 0x63, 0x72, 0x65, 0x74, ...key]` | 41 bytes

### Public key format

Type         | Expected format                                                  | Length
-------------|------------------------------------------------------------------|---------------
`PASERK`     | `k4.public.[key data as base64url]`                              | 53 characters
`Uint8Array` | `[0x6b, 0x34, 0x2e, 0x70, 0x75, 0x62, 0x6c, 0x69, 0x63, ...key]` | 41 bytes

#### Generate a secret/public key pair

You can generate a public/secret key pair in PASERK format using the `generateKeys` function:

```ts
import { generateKeys } from 'paseto-ts/v4';

const { secretKey, publicKey } = generateKeys('public');
// secretKey: k4.secret.xxx..
// publicKey: k4.public.xxx..
```

If you need the keys as buffers, you can pass in `buffer` as the second argument:

```ts
import { generateKeys } from 'paseto-ts/v4';

const { secretKey, publicKey } = generateKeys('public', { format: 'buffer' });
// secretKey: Uint8Array(41)
// publicKey: Uint8Array(41)
```

### Sign a payload

You can pass a `Payload` object, a `string` or an `Uint8Array` to the `sign` function. PASETO defines a set of [registered claims](https://github.com/paseto-standard/paseto-spec/blob/master/docs/02-Implementation-Guide/04-Claims.md#registered-claims) that you can use in your payload. Any registered claims are validated.

```ts
import { sign } from 'paseto-ts/v4';

try {

    const token = await sign(
        // secretKey = k4.secret.xxx..
        secretKey, // string | Uint8Array
        // payload = { sub: '1234567890', name: 'John Doe' }
        payload, // Payload | string | Uint8Array
        {
            // Optional: If footer parses to an object, its `kid` and `wpk` claims will be validated.
            footer, // Footer | string | Uint8Array
            // Optional: Assertion is a JSON.stringifyable object, string or buffer.
            assertion, // Assertion | string | Uint8Array
            // Optional: If true, a default `exp` claim of 1 hour will be added to the payload.
            addExp, // boolean; defaults to true
            // Optional: If true, a default `iat` claim of the current time will be added to the payload.
            addIat, // boolean; defaults to true
            // Optional: Maximum depth of the JSON in the payload and footer objects (if footer parses to an object)
            maxDepth, // number; defaults to 32. 0 to disable
            // Optional: Maximum number of keys in the payload and footer objects (if footer parses to an object)
            maxKeys, // number; defaults to 128. 0 to disable
            // Optional: If true, the payload will be validated against the registered claims.
            validatePayload, // boolean; defaults to true
        }
    );

    // token: v4.public.xxx..

} catch(err) {
    // err: Error
}
```

### Verify a token

```ts
import { verify } from 'paseto-ts/v4';

try {

    // generic type parameter is optional but will give you type safety on the payload
    const { payload, footer } = await verify<{ foo: string }>(  
        // publicKey = k4.public.xxx..
        publicKey, // string | Uint8Array
        // token = v4.public.xxx..
        token, // string | Uint8Array
        {
            // Optional: Assertion is a JSON.stringifyable object, string or buffer.
            assertion, // Assertion | string | Uint8Array
            // Optional: Maximum depth of the JSON in the payload and footer objects (if footer parses to an object)
            maxDepth, // number; defaults to 32. 0 to disable
            // Optional: Maximum number of keys in the payload and footer objects (if footer parses to an object)
            maxKeys, // number; defaults to 128. 0 to disable
            // Optional: If true, the payload will be validated against the registered claims.
            validatePayload, // boolean; defaults to true
        }
    );

    // payload: { sub: '1234567890', name: 'John Doe', iat: "2023-01-01T00:00:00.000Z" }
    // footer: { kid: 'xxx..', wpk: 'xxx..' }

} catch(err) {
    // err: Error
}
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

MIT
