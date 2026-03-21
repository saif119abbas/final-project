import { createMap, forMember, ignore, mapFrom } from "@automapper/core";
import mapper from "@application/shared/mapper/mapper";
import { Job } from "@core/models";
import JobRequest from "@core/dto/jobs/jobRequest.dto";
import JobStatus from "@core/enum/jobStatus.enum";
import JobResponse from "@core/dto/jobs/jobResponse.dto";
import JobDetails from "@core/dto/jobs/jobDetails.dto";
import JobDetailsResult from "@core/dto/jobs/jobDetailsResult.dto";
export default function jobProfile(): void {
  createMap(
    mapper,
    JobRequest,
    Job,
    forMember(
      (d) => d.payload,
      mapFrom((s) => s.payload),
    ),
    forMember((dest) => dest.id, ignore()),
    forMember((dest) => dest.pipelineId, ignore()),
    forMember(
      (dest) => dest.status,
      mapFrom(() => JobStatus.PENDING),
    ),
    forMember((dest) => dest.result, ignore()),
    forMember((dest) => dest.error, ignore()),
    forMember(
      (dest) => dest.scheduledFor,
      mapFrom(() => new Date(Date.now() + 2 * 60 * 1000)),
    ),
    forMember((dest) => dest.createdAt, ignore()),
    forMember((dest) => dest.updatedAt, ignore()),
  );

  createMap(
    mapper,
    Job,
    JobResponse,

    forMember(
      (dest) => dest.pipeline,
      mapFrom((src) => src.pipelineId),
    ),
  );
  createMap(
    mapper,
    JobDetailsResult,
    JobDetails,

    // id
    forMember(
      (dest) => dest.id,
      mapFrom((src) => src.job.id),
    ),

    // pipeline: string
    forMember(
      (dest) => dest.pipeline,
      mapFrom((src) => src.pipeline?.sourcePath ?? ""),
    ),
    forMember(
      (dest) => dest.actionType,
      mapFrom((src) => src.pipeline?.actionType ?? ""),
    ),

    // subscribers: string[]
    forMember(
      (dest) => dest.subscribers,
      mapFrom((src) => src.subscribers.map((s) => s.url ?? "")),
    ),

    // payload
    forMember(
      (dest) => dest.payload,
      mapFrom((src) => src.job.payload),
    ),

    // result
    forMember(
      (dest) => dest.result,
      mapFrom((src) => src.job.result),
    ),

    // status
    forMember(
      (dest) => dest.status,
      mapFrom((src) => src.job.status),
    ),

    // scheduledFor
    forMember(
      (dest) => dest.scheduledFor,
      mapFrom((src) => src.job.scheduledFor),
    ),

    // createdAt
    forMember(
      (dest) => dest.createdAt,
      mapFrom((src) => src.job.createdAt),
    ),

    // metrics (direct mapping works if structure matches)
    forMember(
      (dest) => dest.metrics,
      mapFrom((src) => src.metrics),
    ),
  );
}
