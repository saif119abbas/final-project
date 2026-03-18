"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_repository_1 = __importDefault(require("@infrastructure/repositories/user.repository"));
const validate_1 = __importDefault(require("@presentation/middlewares/validate"));
const auth_1 = __importDefault(require("@presentation/middlewares/auth"));
const findUserById_usecase_1 = __importDefault(require("@application/user/usecases/findUserById.usecase"));
const pipeline_controller_1 = __importDefault(require("@presentation/controllers/pipeline.controller"));
const pipeline_repository_1 = __importDefault(require("@infrastructure/repositories/pipeline.repository"));
const create_usecase_1 = __importDefault(require("@application/pipelines/usecases/create.usecase"));
const subscripers_repository_1 = __importDefault(require("@infrastructure/repositories/subscripers.repository"));
const pipeline_1 = require("@application/pipelines/validation/pipeline");
const update_usecase_1 = __importDefault(require("@application/pipelines/usecases/update.usecase"));
const delete_usecase_1 = __importDefault(require("@application/pipelines/usecases/delete.usecase"));
const getAll_usecase_1 = __importDefault(require("@application/pipelines/usecases/getAll.usecase"));
class PipelineRouter {
    constructor(app) {
        this.app = app;
        // ============================================================================
        // DEPENDENCY INJECTION SETUP
        // ============================================================================
        const pipelineRepository = new pipeline_repository_1.default();
        const subscriberRepository = new subscripers_repository_1.default();
        const userRepository = new user_repository_1.default();
        // ============================================================================
        // USECASES
        // ============================================================================
        const createPipelineUseCase = new create_usecase_1.default(pipelineRepository, subscriberRepository);
        const updatePipelineUseCase = new update_usecase_1.default(pipelineRepository, subscriberRepository);
        const deleteUseCase = new delete_usecase_1.default(pipelineRepository);
        const getAllUseCaese = new getAll_usecase_1.default(pipelineRepository);
        const findUserByIdUsecase = new findUserById_usecase_1.default(userRepository);
        // ============================================================================
        // CONTROLLERS
        // ============================================================================
        this.authMiddleWare = new auth_1.default(findUserByIdUsecase);
        this.controller = new pipeline_controller_1.default(createPipelineUseCase, updatePipelineUseCase, deleteUseCase, getAllUseCaese);
        this.router = (0, express_1.Router)();
        this.registerEndpoints();
    }
    registerEndpoints() {
        this.app.use("/api/pipelines", this.router);
        this.router.use(this.authMiddleWare.authentication);
        this.router.post("/", (0, validate_1.default)(pipeline_1.PipelineRequestSchema), this.controller.createPipeline.bind(this.controller));
        this.router.put("/:id", (0, validate_1.default)(pipeline_1.PipelineRequestSchema), this.controller.updatePipeline.bind(this.controller));
        this.router.delete("/:id", this.controller.deletePipeline.bind(this.controller));
        this.router.get("/", this.controller.getAllPipelines.bind(this.controller));
    }
}
exports.default = PipelineRouter;
