"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const notFoundError_1 = __importDefault(require("../../../core/errors/notFoundError"));
class FindUserByIdUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async call(userId) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new notFoundError_1.default("User not found");
        }
        return user;
    }
}
exports.default = FindUserByIdUseCase;
