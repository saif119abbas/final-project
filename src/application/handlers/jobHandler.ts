import AckType from "@core/enum/ackType.enum";
import { runAction } from "@application/shared/processors/pipelineAction";
import JobMessage from "@core/dto/rabbitmq/jobMessaage";


export  default async function jobHandler(data: JobMessage): Promise<AckType> {
  try {

    const result = await runAction(
      data.actionType,
      data.actionConfig,
      data.payload
    );

    console.log("Job result:", result);

    return AckType.ACK;

  } catch (error) {

    console.error("Job failed:", error);

    return AckType.NACK_DISCARD;
  }
}
