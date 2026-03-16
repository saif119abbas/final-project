import { Express, Router } from "express";
import UserRepository from "@infrastructure/repositories/user.repository";
import validate from "@presentation/middlewares/validate";
import AuthenticationMiddleware from "@presentation/middlewares/auth";
import FindUserByIdUseCase from "@application/user/usecases/findUserById.usecase";
import PipelineController from "@presentation/controllers/pipeline.controller";
import PipelineRepository from "@infrastructure/repositories/pipeline.repository";
import CreatePipelineUseCase from "@application/pipelines/usecases/create.usecase";
import SubscriberRepository from "@infrastructure/repositories/subscripers.repository";
import { PipelineRequestSchema } from "@application/pipelines/validation/pipeline";
import UpdatePipelineUseCase from "@application/pipelines/usecases/update.usecase";
import DeletePipelineUseCase from "@application/pipelines/usecases/delete.usecase";
import GetAllPipelinesUseCase from "@application/pipelines/usecases/getAll.usecase";
export default class PipelineRouter {
  private readonly controller: PipelineController;
  private readonly authMiddleWare: AuthenticationMiddleware;
  private readonly router: Router;
  constructor(private readonly app: Express) {
    // ============================================================================
    // DEPENDENCY INJECTION SETUP
    // ============================================================================
    const pipelineRepository = new PipelineRepository();
    const subscriberRepository = new SubscriberRepository();
    const userRepository=new UserRepository()

    // ============================================================================
    // USECASES
    // ============================================================================
    const createPipelineUseCase = new CreatePipelineUseCase(pipelineRepository,subscriberRepository);
    const updatePipelineUseCase = new UpdatePipelineUseCase(pipelineRepository,subscriberRepository);
    const deleteUseCase = new DeletePipelineUseCase(pipelineRepository);
    const getAllUseCaese = new GetAllPipelinesUseCase(pipelineRepository);
    const findUserByIdUsecase = new FindUserByIdUseCase(userRepository);
    
    // ============================================================================
    // CONTROLLERS
    // ============================================================================
    this.authMiddleWare = new AuthenticationMiddleware(findUserByIdUsecase);
    this.controller = new PipelineController(
      createPipelineUseCase,
      updatePipelineUseCase,
      deleteUseCase,
      getAllUseCaese
    );
    this.router = Router();
    this.registerEndpoints();
  }

private registerEndpoints() {
  this.app.use("/api/pipelines", this.router);

  this.router.use(this.authMiddleWare.authentication);

  this.router.post(
    "/",
    validate(PipelineRequestSchema),
    this.controller.createPipeline.bind(this.controller)
  );
  this.router.put(
    "/:id",
    validate(PipelineRequestSchema),
    this.controller.updatePipeline.bind(this.controller)
  );
  this.router.delete(
    "/:id",
    this.controller.deletePipeline.bind(this.controller)
  );
  this.router.get(
    "/",
    this.controller.getAllPipelines.bind(this.controller)
  );
}

}
