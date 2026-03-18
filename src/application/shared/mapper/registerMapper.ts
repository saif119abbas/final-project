import jobProfile from "@application/jobs/mapper/job.profile";
import pipelineProfile from "@application/pipelines/mapper/pipeline.profile";
import subscripersProfile from "@application/pipelines/mapper/subscripers.profile";
import refreshTokenProfile from "@application/user/mapper/refreshToken.mapper";
import userProfile from "@application/user/mapper/user.profile";

export default function registerMappers(): void {
  userProfile();
  refreshTokenProfile();
  pipelineProfile();
  subscripersProfile();
  jobProfile();
}
