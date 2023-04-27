import { PasetoFormatInvalid, PasetoPurposeInvalid } from '../lib/errors.js';
import { concat, stringToUint8Array } from '../lib/uint8array.js';

import { base64UrlEncode } from '../lib/base64url.js';
import { generateKeyPair } from '@stablelib/ed25519';
import type { GetRandomValues } from '../lib/types.js';

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
 * @param {object} options Options
 * @param {string} options.format Format of the returned key(s) (`paserk` (PASERK) or `buffer` (Uint8Array)); defaults to `paserk`
 * @param {(length: number): Uint8Array} options.getRandomValues Optional crypto.getRandomValues implementation (for Node < 19)
 * @returns {string | Uint8Array | PASERKPublicKeyPair | PASERKPublicKeyPairBuffer} Private and public key pair for `public` purpose, secret key for `local` purpose
 * @see https://github.com/paseto-standard/paseto-spec/blob/master/docs/02-Implementation-Guide/03-Algorithm-Lucidity.md#paseto-cryptography-key-requirements
 */
export function generateKeys(purpose: 'local', opts?: { format?: 'paserk', getRandomValues?: GetRandomValues }): string
export function generateKeys(purpose: 'local', opts?: { format?: 'buffer', getRandomValues?: GetRandomValues }): Uint8Array
export function generateKeys(purpose: 'public', opts?: { format?: 'paserk', getRandomValues?: GetRandomValues }): PASERKPublicKeyPair
export function generateKeys(purpose: 'public', opts?: { format?: 'buffer', getRandomValues?: GetRandomValues }): PASERKPublicKeyPairBuffer
export function generateKeys(purpose: 'local' | 'public', opts: { format?: 'paserk' | 'buffer' | undefined, getRandomValues?: GetRandomValues } = { format: 'paserk' }): string | Uint8Array | PASERKPublicKeyPair | PASERKPublicKeyPairBuffer {

    let ret;
    const format = opts?.format ?? 'paserk';
    const getRandomValues = opts?.getRandomValues ?? crypto?.getRandomValues as GetRandomValues;

    if(!getRandomValues) {
        throw new Error('No compatible getRandomValues implementation detected in the global scope. Please pass a getRandomValues implementation to the options object (signature: getRandomValues<Uint8Array>(array: Uint8Array): Uint8Array)');
    }

    switch (purpose) {
        case 'local':
            // For local keys, we generate a random 32-byte key
            const random = getRandomValues(new Uint8Array(32));
            if(random === null) {
                throw new Error('getRandomValues returned an invalid length Uint8Array');
            }
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
