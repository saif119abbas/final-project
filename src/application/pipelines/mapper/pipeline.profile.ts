import { createMap, forMember, ignore } from "@automapper/core";
import mapper from "@application/shared/mapper/mapper";
import PipelineRequest from "@core/dto/pipeline/pipelineRequest.dto";
import PipelineResponse from "@core/dto/pipeline/pipelineRespone.dto";
import { Pipeline } from "@core/models";

export default function pipelineProfile(): void {
  createMap(
    mapper,
    PipelineRequest,
    Pipeline,
    forMember((dest) => dest.id, ignore()),
    forMember((dest) => dest.createdAt, ignore()),
    forMember((dest) => dest.updatedAt, ignore()),
  );
  createMap(mapper, Pipeline, PipelineResponse);
}
