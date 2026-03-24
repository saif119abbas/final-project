"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const successResponse_1 = require("../http/responses/successResponse");
class JobController {
    constructor(ingestUsecase, getJobDeatailsUsecase, getAttemptsUsecase, getJobsUsecase) {
        this.ingestUsecase = ingestUsecase;
        this.getJobDeatailsUsecase = getJobDeatailsUsecase;
        this.getAttemptsUsecase = getAttemptsUsecase;
        this.getJobsUsecase = getJobsUsecase;
        this.ingest = async (req, res, next) => {
            try {
                const sourcePathParam = req.params.sourcePath;
                const payload = req.body;
                const data = await this.ingestUsecase.call(sourcePathParam, payload);
                res.status(202).json({
                    ok: true,
                    message: "queued",
                    data,
                });
            }
            catch (err) {
                next(err);
            }
        };
        this.getJobDetails = async (req, res, next) => {
            try {
                const jobId = req.params.id;
                const data = await this.getJobDeatailsUsecase.call(jobId);
                (0, successResponse_1.ok)(res, {
                    message: "job details retrieved successfully",
                    data,
                });
            }
            catch (err) {
                next(err);
            }
        };
        this.getAttempts = async (req, res, next) => {
            try {
                const jobId = req.params.id;
                const data = await this.getAttemptsUsecase.call(jobId);
                (0, successResponse_1.ok)(res, {
                    message: "job attempts retrieved successfully",
                    data,
                });
            }
            catch (err) {
                next(err);
            }
        };
        this.getJobs = async (req, res, next) => {
            try {
                const page = req.query.page;
                const limit = req.query.limit;
                const data = await this.getJobsUsecase.call(parseInt(page), parseInt(limit));
                (0, successResponse_1.ok)(res, {
                    message: "jobs retrieved successfully",
                    data,
                });
            }
            catch (err) {
                next(err);
            }
        };
    }
}
exports.default = JobController;
