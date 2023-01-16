import { concat } from "./uint8array";

/**
 * Encode a number as a 64-bit little-endian unsigned integer
 * @param {number} n Number to encode
 * @returns {Uint8Array} 64-bit little-endian unsigned integer
 * @see https://github.com/paseto-standard/paseto-spec/blob/master/docs/01-Protocol-Versions/Common.md#pae-definition
 */
export function LE64(n: number): Uint8Array {

    let arr = new Uint8Array(8);

    // Iterate over each byte
    for (let i = 0; i < 8; ++i) {

        // If we're on the 7th byte, clear the MSB
        if (i === 7) {

            // Clear the MSB for interoperability
            n &= 127;

        }

        // Write the next byte
        arr[i] = n & 255;

        // Shift right by 8 bits
        n = n >>> 8;

    }
    return arr;
}

/**
 * Pack arbitrary data into a single Uint8Array
 * @param {...Uint8Array} pieces Data to pack
 * @returns {Uint8Array} Packed data
 * @see https://github.com/paseto-standard/paseto-spec/blob/master/docs/01-Protocol-Versions/Common.md#pae-definition
 */
export function PAE(...pieces: Uint8Array[]): Uint8Array {

    // Get the number of pieces
    let count = pieces.length;

    // Prepend the number of pieces to the output
    let output = concat(LE64(count));

    // Iterate over each piece
    for (let i = 0; i < count; i++) {

        // Ensure piece is a Uint8Array
        if (!(pieces[i] instanceof Uint8Array)) {
            throw new TypeError('PAE expects Uint8Array arguments');
        }

        // Prepend the length of each piece to the output
        output = concat(output, LE64(pieces[i].length), pieces[i]);

    }
    return output;
}