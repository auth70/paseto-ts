// Extended from https://github.com/panva/paseto/blob/main/lib/errors.js
export const CODES = {
    PasetoNotSupported: 'ERR_PASETO_NOT_SUPPORTED',
    PasetoDecryptionFailed: 'ERR_PASETO_DECRYPTION_FAILED',
    PasetoInvalid: 'ERR_PASETO_INVALID',
    PasetoVerificationFailed: 'ERR_PASETO_VERIFICATION_FAILED',
    PasetoPayloadInvalid: 'ERR_PASETO_PAYLOAD_INVALID',
    PasetoClaimInvalid: 'ERR_PASETO_CLAIM_INVALID',
    PasetoPurposeInvalid: 'ERR_PASETO_PURPOSE_INVALID',
    PasetoFormatInvalid: 'ERR_PASETO_FORMAT_INVALID',
    PasetoKeyInvalid: 'ERR_PASETO_KEY_INVALID',
    PasetoTokenInvalid: 'ERR_PASETO_TOKEN_INVALID',
    PasetoFooterInvalid: 'ERR_PASETO_FOOTER_INVALID',
    PasetoSignatureInvalid: 'ERR_PASETO_SIGNATURE_INVALID',
}

export class PasetoError extends Error {
    public code: string
    constructor(message: string) {
        super(message)
        this.name = this.constructor.name
        this.code = CODES[this.constructor.name as keyof typeof CODES]
    }
}

export class PasetoNotSupported extends PasetoError {};
export class PasetoDecryptionFailed extends PasetoError {};
export class PasetoInvalid extends PasetoError {};
export class PasetoVerificationFailed extends PasetoError {};
export class PasetoPayloadInvalid extends PasetoError {}
export class PasetoClaimInvalid extends PasetoError {};
export class PasetoPurposeInvalid extends PasetoError {}
export class PasetoFormatInvalid extends PasetoError {}
export class PasetoKeyInvalid extends PasetoError {}
export class PasetoTokenInvalid extends PasetoError {}
export class PasetoFooterInvalid extends PasetoError {}
export class PasetoSignatureInvalid extends PasetoError {}
