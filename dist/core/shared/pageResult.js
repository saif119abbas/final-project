"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PageResult {
    constructor(items, total, page, limit) {
        this.items = items;
        this.total = total;
        this.totalPages = Math.ceil(total / limit);
        this.limit = limit;
        this.itemsFrom = (page - 1) * limit + 1;
        this.itemsTo = this.itemsFrom + limit - 1;
    }
}
exports.default = PageResult;
