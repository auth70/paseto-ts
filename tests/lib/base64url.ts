import * as assert from 'uvu/assert';

import { base64UrlDecode, base64UrlEncode } from '../../src/lib/base64url';

import { concat } from '../../src/lib/uint8array';
import { test } from 'uvu';

const INPUT = 'Hello, world!';
const INPUT_BASE64 = 'SGVsbG8sIHdvcmxkIQ==';
const INPUT_BASE64URL = 'SGVsbG8sIHdvcmxkIQ';
const INPUT_UINT8ARRAY = new TextEncoder().encode(INPUT);

test('base64UrlEncode encodes base64url', () => {
    const inputUint8Array = new TextEncoder().encode(INPUT);
    const encoded = base64UrlEncode(inputUint8Array);
    assert.is(encoded, INPUT_BASE64URL);
});

test('base64UrlDecode decodes base64url', () => {
    const decoded = base64UrlDecode(INPUT_BASE64URL);
    assert.is(decoded.byteLength, 13);
    assert.is(new TextDecoder().decode(decoded), INPUT);
});

test('base64UrlDecode throws on invalid base64url', () => {
    assert.throws(() => base64UrlDecode('SGVsbGbbb8sIHdvcmxkIQ'));
});

test('base64UrlDecode throws on invalid type', () => {
    assert.throws(() => base64UrlDecode(123 as any));
});

test('base64UrlEncode throws on invalid type', () => {
    assert.throws(() => base64UrlEncode("foo" as any));
});

test.run();