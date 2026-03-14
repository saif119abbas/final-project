import { z } from "zod";
export const userCreateSchema = z.object({
    name: z
        .string({ error: "name is required and must be a string" })
        .min(1, "name cannot be empty")
        .max(255, "name is too long"),
    username: z
        .string({ error: "Username is required and must be a string" })
        .min(1, "Username cannot be empty")
        .max(255, "Username is too long"),
    password: z
        .string({ error: "Password is required and must be a string" })
        .min(8, "Password cannot be empty and should be at least 8 characters"),
});
