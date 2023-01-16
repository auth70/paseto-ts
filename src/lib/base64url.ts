/**
 * Convert UTF-8 data in a Uint8Array to a string
 * @param {Uint8Array} buffer Uint8Array to convert
 * @returns {string} UTF-8 string representation of the Uint8Array
 *  {TypeError} if the input is not a Uint8Array
 * @see https://developer.mozilla.org/en-US/docs/Glossary/Base64
 * @see https://developer.mozilla.org/en-US/docs/Web/API/btoa
 */
export function base64UrlEncode(buffer: Uint8Array): string {

    if(!(buffer instanceof Uint8Array)) throw new TypeError('Input must be a Uint8Array.');

    // Note: base64UrlEncode from RFC 4648 without padding
    return btoa(String.fromCharCode(...buffer)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

}

/**
 * Convert a base64url encoded string to a Uint8Array
 * @param {string} str base64url encoded string to convert
 * @returns {Uint8Array} Uint8Array representation of the base64url encoded string
 * @see https://developer.mozilla.org/en-US/docs/Glossary/Base64
 * @see https://developer.mozilla.org/en-US/docs/Web/API/atob
 */
export function base64UrlDecode(str: string): Uint8Array {

    // Decode using the regular base64 alphabet.
    const bytes = base64UrlDecodeString(str);

    // Convert to Uint8Array.
    const ua = new Uint8Array(bytes.length);
    for (let i = 0; i < bytes.length; i++) {
        ua[i] = bytes.charCodeAt(i);
    }

    return ua;

}

/**
 * Convert a base64url encoded string to a string
 * @param {string} str base64url encoded string to convert
 * @returns {string} string representation of the base64url encoded string
 */
export function base64UrlDecodeString(str: string): string {
    
    if(typeof str !== 'string') throw new TypeError('Input must be a string.');

    // Replace characters according to the base64url alphabet.
    str = str.replace(/-/g, '+').replace(/_/g, '/');

    // Add padding if necessary.
    switch (str.length % 4) {
        case 0:
            break;
        case 2:
            str += '==';
            break;
        case 3:
            str += '=';
            break;
        default:
            throw new Error('Invalid base64url string.');
    }

    // Decode using the regular base64 alphabet.
    const bytes = atob(str);

    return bytes;
}
