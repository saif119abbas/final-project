"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isSecretValue = (value) => {
    if (typeof value !== "string")
        return false;
    // Check if it looks like a long random token (common pattern)
    // Example: 32+ chars, mix of letters, digits, symbols
    return /^[A-Za-z0-9-_]{32,}$/.test(value);
};
const filterObject = (obj) => {
    if (obj === null || typeof obj !== "object")
        return obj;
    if (Array.isArray(obj)) {
        return obj.map(filterObject);
    }
    return Object.entries(obj).reduce((acc, [key, value]) => {
        const lowerKey = key.toLowerCase();
        // Remove fields containing sensitive words
        if (lowerKey.includes("password") ||
            lowerKey.includes("secret") ||
            lowerKey.includes("key")) {
            return acc;
        }
        if (isSecretValue(value)) {
            return acc;
        }
        acc[key] = filterObject(value);
        return acc;
    }, {});
};
class FilterFieldsAction {
    async execute(payload) {
        const filteredData = filterObject(payload.data);
        return { ...payload, data: filteredData };
    }
}
exports.default = FilterFieldsAction;
