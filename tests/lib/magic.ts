import * as assert from 'uvu/assert';

import { KEY_LENGTHS, KEY_MAGIC_BYTES, KEY_MAGIC_STRINGS, TOKEN_MAGIC_BYTES, TOKEN_MAGIC_STRINGS } from '../../src/lib/magic';

import { stringToUint8Array } from '../../src/lib/uint8array';
import { test } from 'uvu';

const CONTROL_KEY_MAGIC_STRINGS = {
    v4: {
        local: 'k4.local.',
        secret: 'k4.secret.',
        public: 'k4.public.',
    }
};

const CONTROL_TOKEN_MAGIC_STRINGS = {
    v4: {
        local: 'v4.local.',
        public: 'v4.public.',
    }
};

const CONTROL_KEY_LENGTHS = {
    v4: {
        local: 32,
        secret: 64,
        public: 32,
    }
};

test('magic strings are correct', () => {
    assert.equal(KEY_MAGIC_STRINGS, CONTROL_KEY_MAGIC_STRINGS);
    assert.equal(TOKEN_MAGIC_STRINGS, CONTROL_TOKEN_MAGIC_STRINGS);
});

test('magic strings resolve to magic bytes', () => {
    for (const version of Object.keys(KEY_MAGIC_STRINGS)) {
        for (const purpose of Object.keys(KEY_MAGIC_STRINGS[version])) {
            const magicString = KEY_MAGIC_STRINGS[version][purpose];
            const magicBytes = KEY_MAGIC_BYTES[version][purpose];
            assert.equal(stringToUint8Array(magicString), magicBytes);
        }
    }
    for (const version of Object.keys(TOKEN_MAGIC_STRINGS)) {
        for (const purpose of Object.keys(TOKEN_MAGIC_STRINGS[version])) {
            const magicString = TOKEN_MAGIC_STRINGS[version][purpose];
            const magicBytes = TOKEN_MAGIC_BYTES[version][purpose];
            assert.equal(stringToUint8Array(magicString), magicBytes);
        }
    }
});

test('key lengths are correct', () => {
    assert.equal(KEY_LENGTHS, CONTROL_KEY_LENGTHS);
});

test.run();