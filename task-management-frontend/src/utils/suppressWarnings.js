/**
 * Suppress known non-critical warnings
 * These are deprecation warnings from third-party libraries that don't affect functionality
 */

// Suppress ReactQuill findDOMNode deprecation warning
const originalError = console.error;
console.error = function (...args) {
  if (
    typeof args[0] === 'string' &&
    args[0].includes('findDOMNode is deprecated')
  ) {
    return; // Suppress this warning
  }
  originalError.call(console, ...args);
};

// Suppress React Router v7 future flag warnings
const originalWarn = console.warn;
console.warn = function (...args) {
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('React Router Future Flag Warning') ||
     args[0].includes('v7_startTransition') ||
     args[0].includes('v7_relativeSplatPath'))
  ) {
    return; // Suppress these warnings
  }
  originalWarn.call(console, ...args);
};

export default {};
