import * as assert from 'uvu/assert';
import * as crypto from 'node:crypto';

import { PasetoFormatInvalid, PasetoPurposeInvalid } from '../../src/lib/errors';

import { base64UrlDecode } from '../../src/lib/base64url';
import { generateKeys } from '../../src/v4/key';
import { test } from 'uvu';

const getRandomValues = (array: Uint8Array): Uint8Array => {
    const bytes = crypto.randomBytes(array.length);
    array.set(bytes);
    return array;
};

test('it throws with a bad purpose', async () => {
    try {
        const keys = generateKeys('badpurpose' as any, { getRandomValues });
        assert.unreachable('should have thrown');
    } catch (err) {
        assert.instance(err, PasetoPurposeInvalid);
        assert.is(err.code, 'ERR_PASETO_PURPOSE_INVALID');
    }
});

test('it throws with a bad format', async () => {
    try {
        const keys = generateKeys('local', { format: 'päserk' as any, getRandomValues });
        assert.unreachable('should have thrown');
    } catch (err) {
        assert.instance(err, PasetoFormatInvalid);
        assert.is(err.code, 'ERR_PASETO_FORMAT_INVALID');
    }

    try {
        const keys = generateKeys('public', { format: 'päserk' as any, getRandomValues });
        assert.unreachable('should have thrown');
    } catch (err) {
        assert.instance(err, PasetoFormatInvalid);
        assert.is(err.code, 'ERR_PASETO_FORMAT_INVALID');
    }
});

test('generates a random secret key for local purpose (paserk)', async () => {
    const key = generateKeys('local', { format: 'paserk', getRandomValues });
    assert.type(key, 'string');
    assert.is(key.startsWith('k4.local.'), true);
    assert.is(key.split('.')[2].length, 43);
    assert.is(base64UrlDecode(key.split('.')[2]).byteLength, 32);
});

test('generates a random secret key for local purpose (buffer)', async () => {
    const key = generateKeys('local', { format: 'buffer', getRandomValues });
    const keyStr = new TextDecoder().decode(key);
    assert.is(key instanceof Uint8Array, true);
    assert.is(key.byteLength, 41);
    assert.is(keyStr.startsWith('k4.local.'), true);
    assert.is(key.slice(9).byteLength, 32);
});

test('generates a random key pair for public purpose (paserk)', async () => {
    const keyPair = generateKeys('public', { format: 'paserk', getRandomValues });
    assert.type(keyPair, 'object');
    assert.type(keyPair.secretKey, 'string');
    assert.type(keyPair.publicKey, 'string');
    assert.is(keyPair.secretKey.startsWith('k4.secret.'), true);
    assert.is(keyPair.publicKey.startsWith('k4.public.'), true);
    assert.is(keyPair.secretKey.split('.')[2].length, 86);
    assert.is(keyPair.publicKey.split('.')[2].length, 43);
    assert.is(base64UrlDecode(keyPair.secretKey.split('.')[2]).byteLength, 64);
    assert.is(base64UrlDecode(keyPair.publicKey.split('.')[2]).byteLength, 32);
});

test('generates a random key pair for public purpose (buffer)', async () => {
    const keyPair = generateKeys('public', { format: 'buffer', getRandomValues });
    const secretKeyStr = new TextDecoder().decode(keyPair.secretKey);
    const publicKeyStr = new TextDecoder().decode(keyPair.publicKey);
    assert.is(keyPair.secretKey instanceof Uint8Array, true);
    assert.is(keyPair.publicKey instanceof Uint8Array, true);
    assert.is(keyPair.secretKey.byteLength, 74);
    assert.is(keyPair.publicKey.byteLength, 42);
    assert.is(secretKeyStr.startsWith('k4.secret.'), true);
    assert.is(publicKeyStr.startsWith('k4.public.'), true);
    assert.is(keyPair.secretKey.slice(10).byteLength, 64);
    assert.is(keyPair.publicKey.slice(10).byteLength, 32);
});

test('it defaults to paserk format', async () => {
    const key = generateKeys('local', { getRandomValues });
    assert.type(key, 'string');
    assert.is(key.startsWith('k4.local.'), true);
    assert.is(key.split('.')[2].length, 43);
    assert.is(base64UrlDecode(key.split('.')[2]).byteLength, 32);
});

test('on node 19, getRandomValues is not needed', async () => {
    const version = process.version;
    if (version.startsWith('v19')) {
        const key = generateKeys('local', { getRandomValues });
        assert.type(key, 'string');
        assert.is(key.startsWith('k4.local.'), true);
        assert.is(key.split('.')[2].length, 43);
        assert.is(base64UrlDecode(key.split('.')[2]).byteLength, 32);
    } else {
        console.log('skipping test, not node 19');
    }
});

test.run();