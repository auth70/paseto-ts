import * as assert from 'uvu/assert';

import { PasetoDecryptionFailed } from '../../src/lib/errors';
import { decrypt } from '../../src/v4/decrypt';
import { test } from 'uvu';

globalThis.crypto = crypto;

const key = 'k4.local.TTcJUvQkRlymND41zGOLoykZNhoIKk1jtr82bTl9EHA';
const MESSAGE = '{"sub":"johndoe","iat":"2023-01-09T15:34:46.865Z"}';
const MESSAGE_OBJ = {
    payload: {
        sub: 'johndoe',
        iat: '2023-01-09T15:34:46.865Z'
    },
    footer: ''
}

const TOKEN = 'v4.local.fLxh5Fw7OGeXNYiUcHOD4E8fdA3Q59XiUZqGHt2bWtRBQVb5OgI3J5q7n_kVOkDX_J_M16eQQ7l_Cf1a0BRuNLaXHLeXedTC4BWwOKxc992ciiSL0CL5Nv5V1wUdI71DkC_LvB4u5tFELlbjby3PmhNt';
const TOKEN_WITH_FOOTER = 'v4.local.KLyo6Wx6vtCEd3-SuOqhSCLiNsN83HIx02hVP8Lb5QABXC3ISTT9TFDSTmnpDp-7iEDggc9dkHE6iV5HAjpr_vy5iSmvv0hdJl_4ROdG8oN09JlR4bnePEKMMQG1hFqOK9odV9KzzH2tovWfTzd7uzCy.dGVzdA';
const TOKEN_WITH_ASSERTION = 'v4.local.CGV6JWwK9hQWs1bO-yo4o7bWtD_0lsp6sHVObiPSwMH_7YdB-xr6-Zii71Ys8pwlcIYvzXeyEjFCfSLxMi4QsngTO9NqKHMBu-zy637b926yojn2JmiAeSd8CIjl6GxpBaj1LHOm1ESXHsGOOeaCPIwU.dGVzdA';

test('it decrypts a message using a key', () => {
    const decrypted = decrypt(key, TOKEN);
    assert.equal(decrypted, MESSAGE_OBJ);
});

test('it decrypts a message using a key and a footer', () => {
    const decrypted = decrypt(key, TOKEN_WITH_FOOTER);
    assert.equal(decrypted, Object.assign(MESSAGE_OBJ, {
        footer: 'test'
    }));
});

test('it decrypts a message using a key and a footer and an assertion', () => {
    const decrypted = decrypt(key, TOKEN_WITH_ASSERTION, {
        assertion: 'test'
    });
    assert.equal(decrypted, Object.assign(MESSAGE_OBJ, {
        footer: 'test'
    }));
});

test('it throws if token does not match tag', () => {
    try {
        const decrypted = decrypt(key, TOKEN_WITH_ASSERTION);
        assert.unreachable('Should have thrown');
    } catch (e) {
        assert.instance(e, PasetoDecryptionFailed);
    }
});

test.run();

