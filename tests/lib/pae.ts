import * as assert from 'uvu/assert';

import { LE64, PAE } from '../../src/lib/pae';

import { stringToUint8Array } from '../../src/lib/uint8array';
import { test } from 'uvu';

test('it encodes LE64', () => {
    const input = 123456789;
    const output = LE64(input);
    assert.is(output.byteLength, 8);
    assert.equal(output, new Uint8Array([ 0x15, 0xcd, 0x5b, 0x07, 0x00, 0x00, 0x00, 0x00 ]));
});

test('it encodes PAE', () => {
    const input = [
        new Uint8Array([ 0x01, 0x02, 0x03, 0x04, 0x05 ]),
        new Uint8Array([ 0x06, 0x07, 0x08, 0x09, 0x0a ]),
        new Uint8Array([ 0x0b, 0x0c, 0x0d, 0x0e, 0x0f ]),
    ];
    const output = PAE(...input);
    assert.is(output.byteLength, 47);
    assert.equal(output, new Uint8Array([
        3,  0,  0, 0, 0, 0, 0, 0, 5,  0,  0,
        0,  0,  0, 0, 0, 1, 2, 3, 4,  5,  5,
        0,  0,  0, 0, 0, 0, 0, 6, 7,  8,  9,
        10, 5,  0, 0, 0, 0, 0, 0, 0, 11, 12,
        13, 14, 15
    ]));
});

test('PAE([]) will always return "\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00"', () => {
    const input = [];
    const output = PAE(...input);
    assert.is(output.byteLength, 8);
    assert.equal(output, new Uint8Array([ 0, 0, 0, 0, 0, 0, 0, 0 ]));

});

test(`PAE(['']) will always return "\\x01\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00"` , () => {
    const input2 = [stringToUint8Array('')];
    const output2 = PAE(...input2);
    assert.is(output2.byteLength, 16);
    assert.equal(output2, new Uint8Array([ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]));
});

test(`PAE(['test']) will always return "\\x01\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x04\\x00\\x00\\x00\\x00\\x00\\x00\\x00test"` , () => {
    const input3 = [stringToUint8Array('test')];
    const output3 = PAE(...input3);
    assert.is(output3.byteLength, 20);
    assert.equal(output3, new Uint8Array([ 1, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0x74, 0x65, 0x73, 0x74 ]));
});

test(`PAE('test') will throw a TypeError` , () => {
    assert.throws(() => {
        PAE('test' as any);
    }, TypeError);
});
    
test.run();