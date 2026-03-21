"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.publishMsgPack = publishMsgPack;
exports.publishJSON = publishJSON;
const msgpack_1 = require("@msgpack/msgpack");
function publishJSON(ch, exchange, routingKey, value) {
    return new Promise((resolve, reject) => {
        const message = Buffer.from(JSON.stringify(value));
        ch.publish(exchange, routingKey, message, { contentType: "application/json" }, (err) => {
            if (err)
                reject(err);
            else {
                resolve();
            }
        });
    });
}
function publishMsgPack(ch, exchange, routingKey, value) {
    return new Promise((resolve, reject) => {
        const options = {
            contentType: "application/x-msgpack",
        };
        const binaryMessage = Buffer.from((0, msgpack_1.encode)(value, options));
        ch.publish(exchange, routingKey, binaryMessage, { contentType: "application/json" }, (err) => {
            if (err)
                reject(err);
            else {
                resolve();
            }
        });
    });
}
