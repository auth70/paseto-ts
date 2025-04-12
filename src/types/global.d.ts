/**
 * Global type declarations for crypto API
 */
declare global {
    interface Crypto {
        getRandomValues<T extends ArrayBufferView | null>(array: T): T;
    }
    
    interface Window { 
        crypto: Crypto;
    }

    var crypto: Crypto;
}

// This export is needed to make this a module
export {}; 