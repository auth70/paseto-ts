import * as assert from 'uvu/assert';
import * as crypto from 'node:crypto';

import { PasetoKeyInvalid, PasetoPurposeInvalid, PasetoTokenInvalid } from '../../src/lib/errors';
import { concat, stringToUint8Array, uint8ArrayToString } from '../../src/lib/uint8array';
import { parseFooter, parseKeyData, parseLocalToken, parsePayload, parsePublicToken } from '../../src/lib/parse';

import { base64UrlDecode } from '../../src/lib/base64url';
import { constantTimeEqual } from '../../src/lib/validate';
import { generateKeys } from '../../src/v4/key';
import { test } from 'uvu';

globalThis.crypto = crypto;

const LOCAL_KEY = 'k4.local.xqT1zDwAZcNCTd5Ee1B0Wpcjx-xpjbe5oNsFQfEEf-M';
const LOCAL_KEY_BYTES = new Uint8Array([107,  52,  46, 108, 111,  99,  97, 108, 46, 198, 164, 245, 204,  60,   0, 101, 195, 66, 77, 222,  68, 123,  80, 116,  90, 151, 35, 199, 236, 105, 141, 183, 185, 160, 219,  5, 65, 241,   4, 127, 227]);
const ACTUAL_KEY_BYTES = new Uint8Array([198, 164, 245, 204,  60,   0, 101, 195, 66,  77, 222,  68, 123,  80, 116,  90, 151,  35, 199, 236, 105, 141, 183, 185, 160, 219,   5,  65, 241,   4, 127, 227]);

test('it parses a local key from a string', async () => {
    const key = await parseKeyData('local', LOCAL_KEY);
    assert.is(key instanceof Uint8Array, true);
    assert.is(key.byteLength, 32);
    assert.is(constantTimeEqual(key, ACTUAL_KEY_BYTES), true);
});

test('it parses a local key from a Uint8Array', async () => {
    const key = await parseKeyData('local', LOCAL_KEY_BYTES);
    assert.is(key instanceof Uint8Array, true);
    assert.is(key.byteLength, 32);
    assert.is(constantTimeEqual(key, ACTUAL_KEY_BYTES), true);
});

test('it fails to parse a raw key from a string', async () => {
    try {
        await parseKeyData('local', 'xqT1zDwAZcNCTd5Ee1B0Wpcjx-xpjbe5oNsFQfEEf-M');
        assert.unreachable('should have thrown');
    } catch (err) {
        assert.instance(err, PasetoKeyInvalid);
        assert.is(err.code, 'ERR_PASETO_KEY_INVALID');
    }
});

test('it fails to parse a raw key from a Uint8Array', async () => {
    try {
        await parseKeyData('local', ACTUAL_KEY_BYTES);
        assert.unreachable('should have thrown');
    } catch (err) {
        assert.instance(err, PasetoKeyInvalid);
        assert.is(err.code, 'ERR_PASETO_KEY_INVALID');
    }
});

test('it fails with unknown purpose', async () => {
    try {
        await parseKeyData('unknown' as any, LOCAL_KEY);
        assert.unreachable('should have thrown');
    } catch (err) {
        assert.instance(err, PasetoPurposeInvalid);
        assert.is(err.code, 'ERR_PASETO_PURPOSE_INVALID');
    }
});

test('it fails if key data is something else than a string or Uint8Array', async () => {
    try {
        await parseKeyData('local', {} as any);
        assert.unreachable('should have thrown');
    } catch (err) {
        assert.instance(err, PasetoKeyInvalid);
        assert.is(err.code, 'ERR_PASETO_KEY_INVALID');
    }
});

test('it fails if either key or purpose is missing', async () => {
    try {
        await parseKeyData('local', undefined as any);
        assert.unreachable('should have thrown');
    } catch (err) {
        assert.instance(err, TypeError);
    }

    try {
        await parseKeyData(undefined as any, LOCAL_KEY);
        assert.unreachable('should have thrown');
    } catch (err) {
        assert.instance(err, TypeError);
    }
    
});

test('it throws if key is not 32 bytes', async () => {
    try {
        await parseKeyData('local', concat(LOCAL_KEY_BYTES, ACTUAL_KEY_BYTES));
        assert.unreachable('should have thrown');
    } catch (err) {
        assert.instance(err, PasetoKeyInvalid);
        assert.is(err.code, 'ERR_PASETO_KEY_INVALID');
    }
});

test('validateFooter throws if kid claim is not a string', () => {
    assert.throws(() => {
        parseFooter({ kid: 123 } as any);
    });
});

test('validateFooter throws if wpk claim is not a string', () => {
    assert.throws(() => {
        parseFooter({ wpk: 123 } as any);
    });
});

test('validateFooter validates a string footer', () => {
    assert.ok(parseFooter('{}'));
    assert.ok(parseFooter('{"kid":"123"}'));
    assert.ok(parseFooter('{"wpk":"123"}'));
    assert.ok(parseFooter('{"kid":"123","wpk":"123"}'));
    assert.throws(() => {
        parseFooter('{"kid":123}');
    });
    assert.throws(() => {
        parseFooter('{"wpk":123}');
    });
    assert.throws(() => {
        parseFooter('{"kid":123,"wpk":123}');
    });
});

test('validateFooter returns Uint8Array footer', () => {
    const footer = parseFooter(new Uint8Array([ 1, 2, 3 ]));
    assert.ok(footer instanceof Uint8Array);
    assert.equal(footer.length, 3);
    assert.is(footer[0], 1);
    assert.is(footer[1], 2);
    assert.is(footer[2], 3);
});

test('validateFooter returns object footer', () => {
    const footer = parseFooter({ kid: '123' });
    assert.ok(footer instanceof Uint8Array);
});

test('validateFooter returns object footer that is an Uint8Array', () => {
    const footer = parseFooter(stringToUint8Array('{"kid": "123"}'));
    assert.ok(footer instanceof Uint8Array);
});

test('validateFooter throws if input is not a string, Uint8Array or object', () => {
    assert.throws(() => {
        parseFooter(123 as any);
    });
});

//
// parsePayload
//

test('parsePayload validates a string payload', () => {
    assert.ok(parsePayload('{}'));
    assert.ok(parsePayload('{"sub":"123"}'));
    assert.ok(parsePayload('{"sub":"123","exp":"3070-01-01T00:00:00Z"}'));
});

test('parsePayload returns a Payload object with iat and exp claims if not explicitly set in the payload, or told not to set them', () => {
    const payload = parsePayload({ sub: '123' });
    assert.ok(payload.iat);
    assert.ok(payload.exp);
});

test('parsePayload returns a Payload object with iat and exp claims if explicitly set in the payload', () => {
    const payload = parsePayload({ sub: '123', iat: '2019-01-01T00:00:00Z', exp: '3070-01-01T00:00:00Z' });
    assert.equal(payload.iat, '2019-01-01T00:00:00Z');
    assert.equal(payload.exp, '3070-01-01T00:00:00Z');
});

test('parsePayload throws if sub claim is not a string', () => {
    assert.throws(() => {
        parsePayload({ sub: 123 } as any);
    });
});

test('parsePayload throws if exp claim is not an ISO string', () => {
    assert.throws(() => {
        parsePayload({ exp: 123 } as any);
    });
});

test('parsePayload throws if exp claim is not a valid ISO string', () => {
    assert.throws(() => {
        parsePayload({ exp: '123' } as any);
    });
});

test('parsePayload throws if exp claim is in the past', () => {
    try {
        const payload = parsePayload({ exp: '2020-01-01T00:00:00Z', iat: '2019-01-01T00:00:00Z' } as any);
        assert.unreachable('Should have thrown');
    } catch(err) {
        assert.instance(err, Error);
    };
});

test('parsePayload throws if string inside payload is an array', () => {
    assert.throws(() => {
        parsePayload('[]');
    });
});

test('parsePayload throws if exp is before iat', () => {
    assert.throws(() => {
        parsePayload({ iat: '2019-01-01T00:00:00Z', exp: '2018-01-01T00:00:00Z' } as any);
    });
});

test('parsePayload tries to convert a non-ISO string exp', () => {
    const payload = parsePayload({ exp: '1 hour' } as any);
    assert.ok(payload.exp);
});

test('parsePayload throws if iat claim is not an ISO string', () => {
    assert.throws(() => {
        parsePayload({ iat: 123 } as any);
    });
});

test('parsePayload throws if iat claim is not a valid ISO string', () => {
    assert.throws(() => {
        parsePayload({ iat: '123' } as any);
    });
});

test('parsePayload throws if iat claim is in the future', () => {
    assert.throws(() => {
        parsePayload({ iat: '3070-01-01T00:00:00Z' } as any);
    });
});

// nbf

test('parsePayload tries to convert a non-ISO string nbf', () => {
    const payload = parsePayload({ nbf: 123 } as any, {
        addExp: false,
        addIat: false
    });
    assert.ok(payload.nbf);
});

test('parsePayload throws if nbf claim is not a valid ISO string', () => {
    assert.throws(() => {
        parsePayload({ nbf: '123' } as any);
    });
});

test('parsePayload throws if nbf claim is in the future', () => {
    assert.throws(() => {
        parsePayload({ nbf: '3070-01-01T00:00:00Z' } as any);
    });
});

test('parsePayload throws if nbf is before iat', () => {
    assert.throws(() => {
        parsePayload({ iat: '2019-01-01T00:00:00Z', nbf: '2018-01-01T00:00:00Z' } as any);
    });
});

// jti

test('it throws if jti claim is not a string', () => {
    assert.throws(() => {
        parsePayload({ jti: 123 } as any);
    });
});

// iss

test('it throws if iss claim is not a string', () => {
    assert.throws(() => {
        parsePayload({ iss: 123 } as any);
    });
});

// aud

test('it throws if aud claim is not a string', () => {
    assert.throws(() => {
        parsePayload({ aud: 123 } as any);
    });
});

// sub

test('it throws if sub claim is not a string', () => {
    assert.throws(() => {
        parsePayload({ sub: 123 } as any);
    });
});

//
// parseLocalToken
//

test('parseLocalToken parses a local token (string)', () => {
    const token = parseLocalToken('v4.local.AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAr68PS4AXe7If_ZgesdkUMvSwscFlAl1pk5HC0e8kApeaqMfGo_7OpBnwJOAbY9V7WU6abu74MmcUE8YWAiaArVI8XJ5hOb_4v9RmDkneN0S92dx0OW4pgy7omxgf3S8c3LlQg');
    assert.is(token.payload.length, 133);
});

test('parseLocalToken parses a local token (uint8array)', () => {
    const token = parseLocalToken(stringToUint8Array('v4.local.AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAr68PS4AXe7If_ZgesdkUMvSwscFlAl1pk5HC0e8kApeaqMfGo_7OpBnwJOAbY9V7WU6abu74MmcUE8YWAiaArVI8XJ5hOb_4v9RmDkneN0S92dx0OW4pgy7omxgf3S8c3LlQg'));
    assert.is(token.payload.length, 133);
});

test('parseLocalToken parses a token with a footer', () => {
    const token = parseLocalToken('v4.local.AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAr68PS4AXe7If_ZgesdkUMvSwscFlAl1pk5HC0e8kApeaqMfGo_7OpBnwJOAbY9V7WU6abu74MmcUE8YWAiaArVI8XJ5hOb_4v9RmDkneN0S92dx0OW4pgy7omxgf3S8c3LlQg.YWJj');
    assert.equal(token.footer, stringToUint8Array('abc'));
});

test('parseLocalToken throws if a token is more than 4 parts', () => {
    assert.throws(() => {
        parseLocalToken('v4.local.AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAr68PS4AXe7If_ZgesdkUMvSwscFlAl1pk5HC0e8kApeaqMfGo_7OpBnwJOAbY9V7WU6abu74MmcUE8YWAiaArVI8XJ5hOb_4v9RmDkneN0S92dx0OW4pgy7omxgf3S8c3LlQg.abc.def');
    });
});

test('parseLocalToken throws if payload is less than 32 bytes', () => {
    try {
        const f = parseLocalToken('v4.local.abcdef');
        assert.unreachable('should have thrown');
    } catch(err) {
        assert.instance(err, PasetoTokenInvalid);
    }
});

//
// parsePublicToken
//

test('parsePublicToken parses a public token (string)', () => {
    const token = parsePublicToken('v4.public.AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAr68PS4AXe7If_ZgesdkUMvSwscFlAl1pk5HC0e8kApeaqMfGo_7OpBnwJOAbY9V7WU6abu74MmcUE8YWAiaArVI8XJ5hOb_4v9RmDkneN0S92dx0OW4pgy7omxgf3S8c3LlQg');
    assert.is(token.payload.length, 133);
});

test('parsePublicToken parses a public token (uint8array)', () => {
    const token = parsePublicToken(stringToUint8Array('v4.public.AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAr68PS4AXe7If_ZgesdkUMvSwscFlAl1pk5HC0e8kApeaqMfGo_7OpBnwJOAbY9V7WU6abu74MmcUE8YWAiaArVI8XJ5hOb_4v9RmDkneN0S92dx0OW4pgy7omxgf3S8c3LlQg'));
    assert.is(token.payload.length, 133);
});

test('parsePublicToken throws if a token is more than 4 parts', () => {
    assert.throws(() => {
        parsePublicToken('v4.public.AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAr68PS4AXe7If_ZgesdkUMvSwscFlAl1pk5HC0e8kApeaqMfGo_7OpBnwJOAbY9V7WU6abu74MmcUE8YWAiaArVI8XJ5hOb_4v9RmDkneN0S92dx0OW4pgy7omxgf3S8c3LlQg.abc.def');
    });
});

test('parsePublicToken throws if payload is less than 32 bytes', () => {
    assert.throws(() => {
        parsePublicToken('v4.public.AAAAAAAAAAAAAAAAAAAAAAAAA');
    });
});

test.run();
