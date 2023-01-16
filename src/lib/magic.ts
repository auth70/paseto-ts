import { stringToUint8Array } from "./uint8array";

/**
 * Accepted magic strings for each purpose
 */
export const KEY_MAGIC_STRINGS = {
    v4: {
        local: 'k4.local.',
        secret: 'k4.secret.',
        public: 'k4.public.',
    }
};

export const TOKEN_MAGIC_STRINGS = {
    v4: {
        local: 'v4.local.',
        public: 'v4.public.',
    }
};

/**
 * Accepted magic strings as bytes for each purpose
 */
export const KEY_MAGIC_BYTES = {
    v4: {
        // k4.local.
        local: new Uint8Array([0x6b, 0x34, 0x2e, 0x6c, 0x6f, 0x63, 0x61, 0x6c, 0x2e]),
        // k4.secret.
        secret: new Uint8Array([0x6b, 0x34, 0x2e, 0x73, 0x65, 0x63, 0x72, 0x65, 0x74, 0x2e]),
        // k4.public.
        public: new Uint8Array([0x6b, 0x34, 0x2e, 0x70, 0x75, 0x62, 0x6c, 0x69, 0x63, 0x2e]),
    }
};

export const TOKEN_MAGIC_BYTES = {
    v4: {
        // v4.local.
        local: new Uint8Array([0x76, 0x34, 0x2e, 0x6c, 0x6f, 0x63, 0x61, 0x6c, 0x2e]),
        // v4.public.
        public: new Uint8Array([0x76, 0x34, 0x2e, 0x70, 0x75, 0x62, 0x6c, 0x69, 0x63, 0x2e]),
    }
};

/**
 * Accepted key lengths for each purpose (in bytes)
 */
export const KEY_LENGTHS = {
    v4: {
        local: 32,
        secret: 64,
        public: 32,
    }
};

/**
 * Bytes to use for the encryption key 
 */
export const KEY_BYTES = stringToUint8Array('paseto-encryption-key');

/**
 * Bytes to use for the authentication key
 */
export const AUTH_BYTES = stringToUint8Array('paseto-auth-key-for-aead');

export const MAX_DEPTH_DEFAULT = 32;
export const MAX_KEYS_DEFAULT = 128;