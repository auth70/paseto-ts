import type { Footer, Payload } from "../lib/types";
import { MAX_DEPTH_DEFAULT, MAX_KEYS_DEFAULT, TOKEN_MAGIC_BYTES, TOKEN_MAGIC_STRINGS } from "../lib/magic";
import { concat, payloadToUint8Array } from "../lib/uint8array";
import { parseAssertion, parseFooter, parseKeyData, parsePayload } from "../lib/parse";

import { PAE } from "../lib/pae";
import { base64UrlEncode } from "../lib/base64url";
import { sign as ed25519Sign } from '@stablelib/ed25519';

const EMPTY_BUFFER = new Uint8Array(0);

/**
 * Signs a payload using an Ed25519 secret key and returns a PASETO v4.public token.
 * The secret key must have the version and purpose of `k4.secret`.
 * @param {string | Uint8Array} key Ed25519 secret key to sign with
 * @param {Payload | string | Uint8Array} payload Payload to sign
 * @param {object} options Options
 * @param {Footer | string | Uint8Array} options.footer Optional footer
 * @param {string | Uint8Array} options.assertion Optional assertion
 * @param {boolean} options.addIat Add an iat claim if one is not provided; defaults to true
 * @param {boolean} options.addExp Add an exp claim if one is not provided; defaults to true
 * @param {number} options.maxDepth Maximum depth of nested objects in the payload; defaults to 32
 * @param {number} options.maxKeys Maximum number of keys in an object in the payload; defaults to 128
 * @returns {string} PASETO v4.public token
 * @see https://github.com/paseto-standard/paseto-spec/blob/master/docs/01-Protocol-Versions/Version4.md#sign
 */
export function sign(
    key: string | Uint8Array,
    payload: Payload | string | Uint8Array,
    {
        footer = new Uint8Array(0),
        assertion = new Uint8Array(0),
        addExp = true, // Add an exp claim if one is not provided: https://github.com/paseto-standard/paseto-spec/blob/master/docs/02-Implementation-Guide/05-API-UX.md#default-expiration-claims
        addIat = true, // Add an iat claim if one is not provided
        maxDepth = MAX_DEPTH_DEFAULT, // Maximum depth of nested objects
        maxKeys = MAX_KEYS_DEFAULT, // Maximum number of keys in an object
        validatePayload = true, // Validate the payload
    }: {
        footer?: Footer | string | Uint8Array;
        assertion?: string | Uint8Array,
        addExp?: boolean;
        addIat?: boolean;
        maxDepth?: number;
        maxKeys?: number;
        validatePayload?: boolean;
    } = {
        footer: new Uint8Array(0),
        assertion: new Uint8Array(0),
        addExp: true,
        addIat: true,
        maxDepth: MAX_DEPTH_DEFAULT,
        maxKeys: MAX_KEYS_DEFAULT,
        validatePayload: true,
    },
): string {

    // Assert that the key is a v4.secret key, and parse it.
    key = parseKeyData('secret', key);

    const payloadUint8 = payloadToUint8Array(parsePayload(payload, {
        addExp: !!addExp,
        addIat: !!addIat,
        maxDepth,
        maxKeys,
        validate: !!validatePayload,
    }));

    const footerUint8 = parseFooter(footer, {
        maxDepth,
        maxKeys,
        validate: !!validatePayload,
    });

    // Assert assertion is a string or Uint8Array
    assertion = parseAssertion(assertion);

    // Pack header, payload, footer and assertion together using PAE
    const m2 = PAE(
        TOKEN_MAGIC_BYTES.v4.public,
        payloadUint8,
        footerUint8,
        assertion,
    );

    // Sign m2 using Ed25519 secret key
    const sig = ed25519Sign(key, m2);

    let result = '';

    // If footer is empty, return the token without a footer
    // Otherwise, return the token with a footer
    if (footer.length === 0) {
        result = `${TOKEN_MAGIC_STRINGS.v4.public}${base64UrlEncode(concat(payloadUint8, sig))}`;
    } else {
        result = `${TOKEN_MAGIC_STRINGS.v4.public}${base64UrlEncode(concat(payloadUint8, sig))}.${base64UrlEncode(footerUint8)}`;
    }

    return result;

}
