import { z } from "zod";

export const signInSchemaZod = z.object({
    email: z.string(),
    password: z.string().min(6, "Password must be atleast 6 characters"),
})