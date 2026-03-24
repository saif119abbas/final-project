import { z } from "zod";
import ActionType from "@core/enum/actionType.enum";

export const PipelineRequestSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional().nullable(),
  actionType: z.enum(ActionType),
  subscribers: z.array(z.url()).optional(),
});
