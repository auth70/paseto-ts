import type { Footer, Payload } from "./types";
import { PasetoClaimInvalid, PasetoPayloadInvalid, PasetoTokenInvalid } from "./errors";
import { TOKEN_MAGIC_BYTES, TOKEN_MAGIC_STRINGS } from "./magic";
import { assertJsonStringSize, countKeys, getJsonDepth } from './json';
import { stringToUint8Array, uint8ArrayToString } from "./uint8array";

export function isObject(val: any): boolean {
    return !!val && val.constructor == Object;
}

/**
 * Compare two Uint8Arrays in constant time
 * @param {Uint8Array} a First array
 * @param {Uint8Array} b Second array
 * @returns {boolean} true if the arrays are equal, false otherwise
 */
export function constantTimeEqual(a: Uint8Array, b: Uint8Array): boolean {
    if (a.length !== b.length) {
        return false;
    }
    let result = 0;
    for (let i = 0; i < a.length; i++) {
        result |= a[i] ^ b[i];
    }
    return result === 0;
}

/**
 * Validate a date string
 * @param {string} date Date string to validate
 * @returns {boolean} true if the date is valid, false otherwise
 * @see https://github.com/paseto-standard/paseto-spec/blob/master/docs/02-Implementation-Guide/04-Claims.md#payload-claims
 */
export function validateISODate(date: string): boolean {
    if(typeof date !== 'string') return false;
    // date and time MUST be separated with an uppercase "T", and "Z" MUST be capitalized when used as a time offset. 
    // both are valid:
    // - 2022-01-01T14:36:14+00:00
    // - 2023-01-01T14:36:14.754Z
    // but this is not:
    // - 2024-01-01t14:36:14.754z
    return /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(\.\d{1,6})?(([+-]\d{2}:\d{2})|Z)$/.test(date);
}


/**
 * Validate the footer claims.
 * @param obj The footer object to validate.
 */
export function validateFooterClaims(obj: Record<string, any>) {
    // Validate the "kid" claim
    if (obj.hasOwnProperty("kid")) {
        const kid = (obj as any).kid;
        if (typeof kid !== "string") {
            throw new PasetoClaimInvalid("Footer must have a valid \"kid\" claim (is not a string)");
        }
    }
    // Validate the "wpk" claim
    if (obj.hasOwnProperty("wpk")) {
        const wpk = (obj as any).wpk;
        if (typeof wpk !== "string") {
            throw new PasetoClaimInvalid("Footer must have a valid \"wpk\" claim (is not a string)");
        }
    }
}


/**
 * Assert that the token is a valid PASETO token.
 * @param {('local' | 'public')} type The type of token to assert.
 * @param {string | Uint8Array} token The token to assert.
 */
export function validateToken(type: 'local' | 'public', token: Uint8Array | string): Uint8Array | string {
    if(
        (typeof token === 'string' && token.startsWith(TOKEN_MAGIC_STRINGS.v4[type])) ||
        (token instanceof Uint8Array && constantTimeEqual((token as Uint8Array).subarray(0, TOKEN_MAGIC_BYTES.v4[type].length), TOKEN_MAGIC_BYTES.v4[type]))
    ) {
        return token;
    }
    throw new PasetoTokenInvalid(`Invalid token format: must start with "${TOKEN_MAGIC_STRINGS.v4[type]}"`);
}