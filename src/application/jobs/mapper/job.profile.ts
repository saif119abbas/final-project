import { createMap, forMember, ignore, mapFrom } from "@automapper/core";
import mapper from "@application/shared/mapper/mapper";
import { Job } from "@core/models";
import JobRequest from "@core/dto/jobs/jobRequest.dto";
import JobStatus from "@core/enum/jobStatus.enum";
export default function jobProfile(): void {
  createMap(
    mapper,
    JobRequest,
    Job,
    forMember((d) => d.payload, mapFrom((s) => s.payload)),
    forMember((dest) => dest.id, ignore()),
    forMember((dest) => dest.pipelineId, ignore()),
    forMember((dest) => dest.status, mapFrom(() => JobStatus.PENDING)),
    forMember((dest) => dest.result, ignore()),
    forMember((dest) => dest.error, ignore()),
    forMember((dest) => dest.scheduledFor,
      mapFrom(() => new Date(Date.now() + 2 * 60 * 1000))
    ),
    forMember((dest) => dest.createdAt, ignore()),
    forMember((dest) => dest.updatedAt, ignore())
  );
}