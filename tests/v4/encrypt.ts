import * as assert from 'uvu/assert';

import { stringToUint8Array, uint8ArrayToString } from '../../src/lib/uint8array';

import { encrypt } from '../../src/v4/encrypt';
import { test } from 'uvu';

globalThis.crypto = crypto;

const key = 'k4.local.TTcJUvQkRlymND41zGOLoykZNhoIKk1jtr82bTl9EHA';
const MESSAGE = '{"sub":"johndoe","iat":"2023-01-09T15:34:46.865Z"}';

test('it encrypts a message using a key', () => {
    const token = encrypt(key, stringToUint8Array(MESSAGE), {
        addExp: false,
    });
    const splitToken = token.split('.');
    assert.is(splitToken.length, 3);
    assert.is(splitToken[0], 'v4');
    assert.is(splitToken[1], 'local');
});

test('it encrypts a message using a key and a footer', () => {
    const token = encrypt(key, MESSAGE, { footer: 'test', addExp: false });
    const splitToken = token.split('.');
    assert.is(splitToken.length, 4);
    assert.is(splitToken[0], 'v4');
    assert.is(splitToken[1], 'local');
});

test('it encrypts a message using a key and a footer and an assertion', () => {
    const token = encrypt(key, MESSAGE, { footer: 'test', assertion: 'test', addExp: false });
    const splitToken = token.split('.');
    assert.is(splitToken.length, 4);
    assert.is(splitToken[0], 'v4');
    assert.is(splitToken[1], 'local');
});

test('it throws if assertion is not a string or uint8array', () => {
    assert.throws(() => encrypt(key, MESSAGE, { assertion: 1 as any }));
});

test.run();
