import { z } from "zod";

// Zod schema for Contact validation
export const contactSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters"),
  email: z
    .string()
    .email("Invalid email format")
    .max(100, "Email must be at most 100 characters"),
  phone: z
    .string()
    .min(7, "Phone must be at least 7 characters")
    .max(20, "Phone must be at most 20 characters")
    .optional(),
});
