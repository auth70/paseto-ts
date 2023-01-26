import { Footer, Payload } from '../lib/types.js';
import { MAX_DEPTH_DEFAULT, MAX_KEYS_DEFAULT, TOKEN_MAGIC_BYTES } from '../lib/magic.js';
import { parseAssertion, parseFooter, parseKeyData, parsePayload, parsePublicToken } from '../lib/parse.js';

import { PAE } from '../lib/pae.js';
import { PasetoSignatureInvalid } from '../lib/errors.js';
import { verify as ed25519Verify } from '@stablelib/ed25519';
import { returnPossibleJson } from '../lib/json.js';
import { uint8ArrayToString } from '../lib/uint8array.js';
import { validateToken } from '../lib/validate.js';

/**
 * Verifies a PASETO v4.public token using the supplied Ed25519 public key.
 * The public key must have the version and purpose of `k4.public`.
 * @param {string | Uint8Array} key Ed25519 public key to verify with
 * @param {string | Uint8Array} token PASETO v4.public token to verify
 * @param {object} options Options
 * @param {string | Uint8Array} options.assertion Optional assertion
 * @param {number} options.maxDepth Maximum depth of nested objects in the payload and footer; defaults to 32
 * @param {number} options.maxKeys Maximum number of keys in an object in the payload and footer; defaults to 128
 * @returns {object} Object containing the payload and footer
 * @see https://github.com/paseto-standard/paseto-spec/blob/master/docs/01-Protocol-Versions/Version4.md#verify
 */
export function verify(
    key: string | Uint8Array,
    token: string | Uint8Array,
    {
        assertion = new Uint8Array(0),
        maxDepth = MAX_DEPTH_DEFAULT,
        maxKeys = MAX_KEYS_DEFAULT,
        validatePayload = true,
    }:
    {
        assertion?: string | Uint8Array;
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
    payload: Payload;
    footer?: Footer | string;
} {

    // Bail out early if token does not start with magic string or bytes
    validateToken('public', token);

    // Assert key is a Uint8Array or string and parse it
    key = parseKeyData('public', key);

    // Split token into payload, footer and signature
    const { message, signature, footer } = parsePublicToken(token);

    // Validate footer
    if (footer.length > 0) {
        parseFooter(footer, {
            maxDepth,
            maxKeys,
            validate: !!validatePayload,
        });
    }

    assertion = parseAssertion(assertion);

    // Pack header, message, footer and assertion together using PAE
    const m2 = PAE(
        TOKEN_MAGIC_BYTES.v4.public,
        message,
        footer,
        assertion
    );

    // Use Ed25519 to verify signature
    const valid = ed25519Verify(key, m2, signature);

    if(!valid) {
        throw new PasetoSignatureInvalid("Invalid token signature");
    }

    // Parse message as JSON
    const s = uint8ArrayToString(message);

    return {
        payload: parsePayload(s, {
            addExp: false,
            addIat: false,
            maxDepth,
            maxKeys,
            validate: !!validatePayload,
        }),
        footer: returnPossibleJson(footer)
    };
}
