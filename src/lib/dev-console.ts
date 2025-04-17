// src/lib/dev-console.ts

// Save original console methods
const originalConsole = {
    log: console.log,
    debug: console.debug,
    info: console.info,
    warn: console.warn,
    error: console.error
};

// Override console methods in development only
if (process.env.NODE_ENV !== 'production') {
    // Keep normal functionality in development
} else {
    // Disable log, debug, info in production
    console.log = () => { };
    console.debug = () => { };
    console.info = () => { };

    // Keep error and warning functionality
    // You could also replace these with Sentry or other production logging
}

export default originalConsole; // Export original for special cases