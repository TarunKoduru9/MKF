import { z } from "zod";

export const signupSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export const loginInitSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1, "Password is required")
});

export const verify2faSchema = z.object({
    email: z.string().email(),
    code: z.string().length(6, "Code must be 6 digits")
});
