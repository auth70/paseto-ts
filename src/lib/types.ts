export type PasetoPurpose = 'local' | 'public';

export interface Payload {
    [key: string]: any;
    iss?: string;
    sub?: string;
    aud?: string;
    exp?: string;
    nbf?: string;
    jti?: string;
    iat?: string;
}

export interface Footer {
    [key: string]: any;
    kid?: string;
    wpk?: string;
}

export type GetRandomValues = (array: Uint8Array) => Uint8Array;
