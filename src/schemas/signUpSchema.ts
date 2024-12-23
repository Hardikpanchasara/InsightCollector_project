import { z } from "zod";

export const usernameValidation = z
    .string()
    .min(2, { message: "Username must be atlease 2 characters" })
    .max(20, { message: "must be no more than 20 characters" })
    .regex(/^[a-zA-Z0-9_]+$/, {
        message: "Username must not contain special character",
    });

export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({ message: "Invalid email address" }),
    password: z
        .string()
        .min(6, { message: "password must be at least 6 characters" }),
});