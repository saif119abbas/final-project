"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SimpleQueueType;
(function (SimpleQueueType) {
    SimpleQueueType[SimpleQueueType["Durable"] = 0] = "Durable";
    SimpleQueueType[SimpleQueueType["Transient"] = 1] = "Transient";
})(SimpleQueueType || (SimpleQueueType = {}));
exports.default = SimpleQueueType;
