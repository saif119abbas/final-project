import {z} from "zod"
export const UserRequestSchema = z.object({
  email: z.email("Invalid email format"),

  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be at most 30 characters"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
});
