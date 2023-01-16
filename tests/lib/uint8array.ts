import * as assert from 'uvu/assert';

import { concat, payloadToUint8Array, stringToUint8Array } from '../../src/lib/uint8array';

import { test } from 'uvu';

const INPUT = 'Hello, world!';
const INPUT_UINT8ARRAY = new Uint8Array([ 72, 101, 108, 108, 111, 44, 32, 119, 111, 114, 108, 100, 33 ]);

test('it concatenates two Uint8Arrays', () => {
    const a = stringToUint8Array('Hello, ');
    const b = stringToUint8Array('world!');
    const c = concat(a, b);
    assert.is(c.byteLength, 13);
    assert.equal(c, INPUT_UINT8ARRAY);
});

test('it converts a string to a Uint8Array', () => {
    const output = stringToUint8Array(INPUT);
    assert.is(output.byteLength, 13);
    assert.equal(output, INPUT_UINT8ARRAY);
});

test('it converts a JSON string to a Uint8Array', () => {
    const output = payloadToUint8Array('{"foo":"bar"}');
    assert.is(output.byteLength, 13);
    assert.equal(output, new Uint8Array([123, 34, 102, 111, 111, 34, 58, 34, 98, 97, 114, 34, 125]));
});

test('it converts a Uint8Array to a Uint8Array', () => {
    const output2 = payloadToUint8Array(INPUT_UINT8ARRAY);
    assert.is(output2.byteLength, 13);
    assert.equal(output2, INPUT_UINT8ARRAY);
});

test('it converts an object to a Uint8Array', () => {
    const output3 = payloadToUint8Array({ foo: 'bar' });
    assert.is(output3.byteLength, 13);
    assert.equal(output3, new Uint8Array([123, 34, 102, 111, 111, 34, 58, 34, 98, 97, 114, 34, 125]));
});

test('it throws if the input is a number', () => {
    assert.throws(() => {
        payloadToUint8Array(123 as any);
    });
});

test('it throws if the input is an incomplete JSON string', () => {
    assert.throws(() => {
        payloadToUint8Array("{ foo: 'bar' ");
    });
});

test('payloadToUint8Array throws if the input is not a string, object, or Uint8Array', () => {
    assert.throws(() => {
        payloadToUint8Array(123 as any);
    });
});

test('payloadToUint8Array throws if the input is a string that is not JSON', () => {
    assert.throws(() => {
        payloadToUint8Array('foo');
    });
});

test.run();