"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = __importDefault(require("./user"));
const pipeline_1 = __importDefault(require("./pipeline"));
const job_1 = __importDefault(require("./job"));
class Router {
    constructor(app, ch) {
        this.app = app;
        this.ch = ch;
        this.registerEndpoints();
    }
    registerEndpoints() {
        new user_1.default(this.app);
        new pipeline_1.default(this.app);
        new job_1.default(this.app, this.ch);
    }
}
exports.default = Router;
