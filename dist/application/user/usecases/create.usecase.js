"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userResponse_dto_1 = __importDefault(require("../../../core/dto/user/userResponse.dto"));
const models_1 = require("../../../core/models");
const mapper_1 = __importDefault(require("../../shared/mapper/mapper"));
const userRequest_dto_1 = __importDefault(require("../../../core/dto/user/userRequest.dto"));
const databaseError_1 = __importDefault(require("../../shared/db/databaseError"));
const conflictError_1 = __importDefault(require("../../../core/errors/conflictError"));
class CreateUserUseCase {
    constructor(userRepository, encryptPassword) {
        this.userRepository = userRepository;
        this.encryptPassword = encryptPassword;
    }
    async call(data) {
        try {
            const user = mapper_1.default.map(data, userRequest_dto_1.default, models_1.User);
            user.password = this.encryptPassword(data.password);
            const result = await this.userRepository.create(user);
            return mapper_1.default.map(result, models_1.User, userResponse_dto_1.default);
        }
        catch (error) {
            if ((0, databaseError_1.default)(error) && error.cause.code === "23505") {
                console.error("Conflict error: This user already exists.");
                throw new conflictError_1.default("user", "email", data.email);
            }
            throw error;
        }
    }
}
exports.default = CreateUserUseCase;
