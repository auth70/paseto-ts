import { PasetoInvalid } from "./errors.js";
import { isObject } from "./validate.js";

const decoder = new TextDecoder();
const encoder = new TextEncoder();

/**
* Convert a UTF-8 string to a Uint8Array
* @param {string} str String to convert
* @returns {Uint8Array} Uint8Array representation of the string
* @see https://developer.mozilla.org/en-US/docs/Web/API/TextEncoder/encode
*/
export function stringToUint8Array(str: string): Uint8Array {
    return encoder.encode(str);
}

/**
* Convert a Uint8Array to a UTF-8 string
* @param {Uint8Array} arr Uint8Array to convert
* @returns {string} String representation of the Uint8Array
*/
export function uint8ArrayToString(arr: Uint8Array): string {
    return decoder.decode(arr);
}

/**
* Concatenate multiple Uint8Arrays
* @param {...Uint8Array} arrays Arrays to concatenate
* @returns {Uint8Array} Concatenated array
* @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array
*/
export function concat(...arrays: Uint8Array[]): Uint8Array {
    let totalLength = 0;
    for (const arr of arrays) {
        totalLength += arr.length;
    }
    const result = new Uint8Array(totalLength);
    let offset = 0;
    for (const arr of arrays) {
        result.set(arr, offset);
        offset += arr.length;
    }
    return result;
}

/**
* Convert a string, object, or Uint8Array to a Uint8Array
* @param {string | object | Uint8Array} input Input to convert
* @returns {Uint8Array} Uint8Array representation of the input
*/
export function payloadToUint8Array(input: string | object | Uint8Array): Uint8Array {
    if(input instanceof Uint8Array) {
        // If the input is already a Uint8Array, return it
        return input;
    }
    if(typeof input === 'string') {
        try {
            // If the input is a string, try to parse it as JSON
            // Assume that by this point the input string has been validated and is safe to parse
            JSON.parse(input);
            return stringToUint8Array(input);
        } catch(e) {
            throw new PasetoInvalid('Invalid payload. Payload must be a JSON string, object, or Uint8Array.');
        }
    } else if(isObject(input)) {
        // If the input is an object, try to stringify it
        return stringToUint8Array(JSON.stringify(input));
    }
    throw new PasetoInvalid('Invalid payload. Payload must be a JSON string, object, or Uint8Array.');
}
