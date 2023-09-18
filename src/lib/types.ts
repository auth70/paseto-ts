export type PasetoPurpose = 'local' | 'public';

export type Assertion = {
    [key: string]: any;
} | string | Uint8Array;

export type Payload = {
    [key: string]: any;
    iss?: string;
    sub?: string;
    aud?: string;
    exp?: string;
    nbf?: string;
    jti?: string;
    iat?: string;
}

export type Footer = {
    [key: string]: any;
    kid?: string;
    wpk?: string;
}

export type GetRandomValues = (array: Uint8Array) => Uint8Array;
