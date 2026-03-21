"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runAction = runAction;
const actionType_enum_1 = __importDefault(require("../../../core/enum/actionType.enum"));
async function runAction(actionType, actionConfig, payload) {
    switch (actionType) {
        case actionType_enum_1.default.UPPERCASE:
            return uppercase(payload);
        case actionType_enum_1.default.ADD_TIMESTAMP:
            return addTimestamp(payload);
        case actionType_enum_1.default.MAKE_API_CALL:
            return makeApiCall(actionConfig, payload);
        default:
            return payload;
    }
}
function uppercase(payload) {
    if (typeof payload === "string")
        return payload.toUpperCase();
    if (payload && typeof payload === "object" && "text" in payload) {
        const value = payload.text;
        if (typeof value === "string") {
            return {
                ...payload,
                text: value.toUpperCase(),
            };
        }
    }
    return payload;
}
function addTimestamp(payload) {
    const timestamp = new Date().toISOString();
    if (payload && typeof payload === "object" && !Array.isArray(payload)) {
        return { ...payload, timestamp };
    }
    return { payload, timestamp };
}
async function makeApiCall(actionConfig, payload) {
    const url = actionConfig.url;
    if (typeof url !== "string" || !url) {
        throw new Error("MAKE_API_CALL requires actionConfig.url");
    }
    const method = typeof actionConfig.method === "string" ? actionConfig.method : "POST";
    const headers = {
        "content-type": "application/json",
    };
    const extraHeaders = actionConfig.headers;
    if (extraHeaders && typeof extraHeaders === "object") {
        for (const [k, v] of Object.entries(extraHeaders)) {
            if (typeof v === "string")
                headers[k] = v;
        }
    }
    const res = await fetch(url, {
        method,
        headers,
        body: method === "GET" ? undefined : JSON.stringify(payload),
    });
    const contentType = res.headers.get("content-type") ?? "";
    const text = await res.text();
    const body = contentType.includes("application/json") && text ? safeJsonParse(text) : text;
    if (!res.ok) {
        throw new Error(`MAKE_API_CALL failed: ${res.status} ${res.statusText} - ${truncate(typeof body === "string" ? body : JSON.stringify(body))}`);
    }
    return body;
}
function safeJsonParse(text) {
    try {
        return JSON.parse(text);
    }
    catch {
        return text;
    }
}
function truncate(s, max = 500) {
    return s.length <= max ? s : `${s.slice(0, max)}...`;
}
