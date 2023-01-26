import { PasetoFormatInvalid, PasetoPurposeInvalid } from '../lib/errors.js';
import { concat, stringToUint8Array } from '../lib/uint8array.js';

import { base64UrlEncode } from '../lib/base64url.js';
import { generateKeyPair } from '@stablelib/ed25519';

export interface PASERKPublicKeyPair {
    secretKey: string;
    publicKey: string;
}

export interface PASERKPublicKeyPairBuffer {
    secretKey: Uint8Array;
    publicKey: Uint8Array;
}

/**
 * Generates a secret key (`local` purpose) or key pair (`public` purpose).
 * The keys are scoped to the purpose and version of PASETO; when parsing a token, the key must be
 * the same purpose and version as the token. This prevents a `v4.public` key from being used to
 * parse a `v4.local` token or vice versa.
 * 
 * To use the generated key(s) in another PASETO implementation, specify the format as `paserk`.
 * @param {string} purpose `local` (encrypt/decrypt) or `public` (sign/verify)
 * @param {string} format `paserk` (PASERK) or `buffer` (Uint8Array)
 * @returns {string | Uint8Array | PASERKPublicKeyPair | PASERKPublicKeyPairBuffer} Private and public key pair for `public` purpose, secret key for `local` purpose
 * @see https://github.com/paseto-standard/paseto-spec/blob/master/docs/02-Implementation-Guide/03-Algorithm-Lucidity.md#paseto-cryptography-key-requirements
 */
export function generateKeys(purpose: 'local', format?: 'paserk'): string
export function generateKeys(purpose: 'local', format?: 'buffer'): Uint8Array
export function generateKeys(purpose: 'public', format?: 'paserk'): PASERKPublicKeyPair
export function generateKeys(purpose: 'public', format?: 'buffer'): PASERKPublicKeyPairBuffer
export function generateKeys(purpose: 'local' | 'public', format: 'paserk' | 'buffer' | undefined = 'paserk'): string | Uint8Array | PASERKPublicKeyPair | PASERKPublicKeyPairBuffer {

    let ret;

    switch (purpose) {
        case 'local':
            // For local keys, we generate a random 32-byte key
            const random = new Uint8Array(32);
            crypto.getRandomValues(random);
            switch (format) {
                case 'paserk':
                    ret = `k4.local.${base64UrlEncode(random)}`;
                    break;
                case 'buffer':
                    ret = concat(stringToUint8Array('k4.local.'), random);
                    break;
                default:
                    throw new PasetoFormatInvalid(`Invalid format: ${format}`)
            }
            break;
        case 'public':
            // For public keys, we generate an Ed25519 key pair
            const keyPair = generateKeyPair();
            switch (format) {
                case 'paserk':
                    ret = {
                        secretKey: `k4.secret.${base64UrlEncode(keyPair.secretKey)}`,
                        publicKey: `k4.public.${base64UrlEncode(keyPair.publicKey)}`,
                    }
                    break;
                case 'buffer':
                    ret = {
                        secretKey: concat(stringToUint8Array('k4.secret.'), keyPair.secretKey),
                        publicKey: concat(stringToUint8Array('k4.public.'), keyPair.publicKey),
                    }
                    break;
                default:
                    throw new PasetoFormatInvalid(`Invalid format: ${format}`)
            }
            break;
        default:
            throw new PasetoPurposeInvalid(`Invalid purpose: ${purpose}`)
    }

    return ret;
}
