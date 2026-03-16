"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const successResponse_1 = require("@presentation/http/responses/successResponse");
class PipelineController {
    constructor(createUseCase, updateUseCase, deleteUseCase, getAllUseCase) {
        this.createUseCase = createUseCase;
        this.updateUseCase = updateUseCase;
        this.deleteUseCase = deleteUseCase;
        this.getAllUseCase = getAllUseCase;
        this.createPipeline = async (req, res, next) => {
            try {
                const pipeline = req.body;
                const data = await this.createUseCase.call(req.userId, pipeline);
                (0, successResponse_1.created)(res, {
                    message: "pipeline created successfully",
                    data,
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.updatePipeline = async (req, res, next) => {
            try {
                const pipeline = req.body;
                const id = req.params.id;
                const data = await this.updateUseCase.call(req.userId, id, pipeline);
                (0, successResponse_1.ok)(res, {
                    message: "pipeline updated successfully",
                    data,
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.deletePipeline = async (req, res, next) => {
            try {
                const id = req.params.id;
                await this.deleteUseCase.call(id);
                (0, successResponse_1.noContent)(res);
            }
            catch (error) {
                next(error);
            }
        };
        this.getAllPipelines = async (req, res, next) => {
            try {
                const page = Number(req.query.page) ?? 1;
                const limit = Number(req.query.limit) ?? 10;
                const data = await this.getAllUseCase.call(page, limit);
                (0, successResponse_1.ok)(res, {
                    message: "pipeline retrieved successfully",
                    data,
                });
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.default = PipelineController;
