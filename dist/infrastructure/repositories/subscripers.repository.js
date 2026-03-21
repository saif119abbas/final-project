"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = require("../db/schema");
const repository_1 = __importDefault(require("./repository"));
const db_1 = require("../db");
const drizzle_orm_1 = require("drizzle-orm");
class SubscriberRepository extends repository_1.default {
    constructor() {
        super(schema_1.subscribers);
    }
    async findByPipelineId(pipelineId) {
        const results = await db_1.db
            .select()
            .from(schema_1.subscribers)
            .where((0, drizzle_orm_1.eq)(schema_1.subscribers.pipelineId, pipelineId));
        return results;
    }
}
exports.default = SubscriberRepository;
