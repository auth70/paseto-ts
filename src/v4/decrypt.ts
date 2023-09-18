import type { Assertion, Footer, Payload } from "../lib/types.js";
import { MAX_DEPTH_DEFAULT, MAX_KEYS_DEFAULT, TOKEN_MAGIC_BYTES } from "../lib/magic.js";
import { constantTimeEqual, validateToken } from "../lib/validate.js";
import { deriveEncryptionAndAuthKeys, parseAssertion, parseFooter, parseKeyData, parseLocalToken, parsePayload } from "../lib/parse.js";

import { PAE } from "../lib/pae.js";
import { PasetoDecryptionFailed } from '../lib/errors.js';
import { hash } from "@stablelib/blake2b";
import { returnPossibleJson } from "../lib/json.js";
import { streamXOR } from "@stablelib/xchacha20";

/**
 * Decrypts a PASETO v4.local token and returns the message.
 * The key must have the version and purpose of `k4.local`.
 * @param {string | Uint8Array} key 32 byte key used to encrypt the message. Must be prepended with `k4.local.`.
 * @param {string | Uint8Array} token PASETO v4.local token
 * @param {object} options Options
 * @param {Footer | string | Uint8Array} options.footer Optional footer
 * @param {Assertion | string | Uint8Array} options.assertion Optional assertion
 * @param {number} options.maxDepth Maximum depth of nested objects in the payload and footer; defaults to 32
 * @param {number} options.maxKeys Maximum number of keys in an object in the payload and footer; defaults to 128
 * @returns {Uint8Array} Decrypted payload
 * @see https://github.com/paseto-standard/paseto-spec/blob/master/docs/01-Protocol-Versions/Version4.md#decrypt
 */
export function decrypt<T extends { [key: string]: any } = { [key: string]: any }>(
    key: string | Uint8Array,
    token: string | Uint8Array,
    {
        assertion = new Uint8Array(0),
        maxDepth = MAX_DEPTH_DEFAULT,
        maxKeys = MAX_KEYS_DEFAULT,
        validatePayload = true,
    }: {
        assertion?: Assertion | string | Uint8Array;
        maxDepth?: number;
        maxKeys?: number;
        validatePayload?: boolean;
    } = {
        assertion: new Uint8Array(0),
        maxDepth: MAX_DEPTH_DEFAULT,
        maxKeys: MAX_KEYS_DEFAULT,
        validatePayload: true,
    }
): {
    payload: Payload & T,
    footer: Footer | string,
} {

    // Bail out early if token does not start with magic string or bytes
    validateToken('local', token);

    // Assert key is a Uint8Array or string and parse it
    key = parseKeyData('local', key);

    // Split message into payload and footer (if present)
    const { nonce, ciphertext, tag, footer } = parseLocalToken(token);

    // Validate footer
    parseFooter(footer, {
        maxDepth,
        maxKeys,
        validate: !!validatePayload,
    });

    assertion = parseAssertion(assertion);

    // Derive encryption and authentication keys from the key and nonce
    const { encryptionKey, counterNonce, authKey } = deriveEncryptionAndAuthKeys(key, nonce);

    // Concatenate header, nonce, ciphertext, footer, and assertion for pre-auth using PAE
    const preAuth = PAE(
        TOKEN_MAGIC_BYTES.v4.local,
        nonce,
        ciphertext,
        footer,
        assertion as Uint8Array,
    );

    // Calculate tag2 from pre-auth and auth key
    const tag2 = hash(preAuth, 32, { key: authKey });

    // Check that tag and tag2 match
    if (!constantTimeEqual(tag, tag2)) {
        throw new PasetoDecryptionFailed('Decryption failed: invalid authentication tag');
    }

    // Decrypt ciphertext and return plaintext
    const plaintext = streamXOR(encryptionKey, counterNonce, ciphertext, new Uint8Array(ciphertext.length));

    return {
        payload: parsePayload(plaintext, {
            addExp: false,
            addIat: false,
            validate: !!validatePayload,
        }) as Payload & T,
        footer: returnPossibleJson(footer)
    };

}
