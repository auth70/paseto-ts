import { PasetoPayloadInvalid } from "./errors";

const decoder = new TextDecoder();

//
// These first two implementations are copied from the PASETO implementation guide:
// https://github.com/paseto-standard/paseto-spec/blob/master/docs/02-Implementation-Guide/01-Payload-Processing.md#enforcing-maximum-depth-without-parsing-the-json-string
//

/**
 * Get the depth of a JSON string. 
 * @param {string} data JSON string
 * @returns {number} Depth of the JSON string
 * @see https://github.com/paseto-standard/paseto-spec/blob/master/docs/02-Implementation-Guide/01-Payload-Processing.md#enforcing-maximum-depth-without-parsing-the-json-string
 */
export function getJsonDepth(data: string): number {
    // Step 1
    let stripped = data.replace(/\\"/g, '').replace(/\s+/g, '');
    
    // Step 2
    stripped = stripped.replace(/"[^"]+"([:,\}\]])/g, '$1');
    
    // Step 3
    stripped = stripped.replace(/[^\[\{\}\]]/g, '');
    
    // Step 4
    if (stripped.length === 0) {
        return 1;
    }
    // Step 5
    let previous = '';
    let depth = 1;
    
    // Step 6
    while (stripped.length > 0 && stripped !== previous) {
        previous = stripped;
        stripped = stripped.replace(/({}|\[\])/g, '');
        depth++;
    }
    
    // Step 7
    if (stripped.length > 0) {
        throw new Error(`Invalid JSON string`);
    }
    
    // Step 8
    return depth;
}

/**
 * Split the string based on the number of `":` pairs without a preceding
 * backslash, then return the number of pieces it was broken into.
 * @param {string} json JSON string
 * @returns {number} Number of keys in the JSON string
 * @see https://github.com/paseto-standard/paseto-spec/blob/master/docs/02-Implementation-Guide/01-Payload-Processing.md#enforcing-maximum-key-count-without-parsing-the-json-string
 */
export function countKeys(json: string): number {
    return json.split(/[^\\]":/).length;
}

/**
 * Assert that a JSON string is within the maximum depth and key count
 * @param {string} json JSON string
 * @param {number} maxDepth Maximum depth of the JSON string
 * @param {number} maxKeys Maximum number of keys in the JSON string
 * @returns {boolean} true if the JSON string is valid, false otherwise
 * @see https://github.com/paseto-standard/paseto-spec/blob/master/docs/02-Implementation-Guide/01-Payload-Processing.md#enforcing-maximum-depth-without-parsing-the-json-string
 */
export function assertJsonStringSize(json: string, { maxDepth = 10, maxKeys = 100 }: { maxDepth: number, maxKeys: number }): boolean {
    // assert json is a string
    if (typeof json !== 'string') {
        throw new PasetoPayloadInvalid(`JSON string must be a string (got ${typeof json}))`);
    }
    if(maxDepth || maxKeys) {

        const depth = getJsonDepth(json);
        const keys = countKeys(json);
        if (maxDepth && maxDepth > 0 && depth > maxDepth) {
            throw new PasetoPayloadInvalid(`JSON string exceeds maximum depth of ${maxDepth}`);
        }
        if (maxKeys && maxKeys > 0 && keys > maxKeys) {
            throw new PasetoPayloadInvalid(`JSON string exceeds maximum number of keys of ${maxKeys}`);
        }

    }
    return true;
}

/**
 * Returns possible JSON object or string
 * @param {string | Uint8Array} json Possible JSON string
 * @returns {string | object} JSON object or string
 */
export function returnPossibleJson(json?: string | Uint8Array): string | object {
    if(!json) {
        return '';
    }
    if (json instanceof Uint8Array) {
        json = decoder.decode(json);
    }
    try {
        return JSON.parse(json);
    } catch (e) {
        return json;
    }
}