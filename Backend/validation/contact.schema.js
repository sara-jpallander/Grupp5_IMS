import { z } from "zod";

// Zod schema for Contact validation
export const contactSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters"),
  email: z
    .email("Invalid email format")
    .max(100, "Email must be at most 100 characters"),
  phone: z
    .string()
    .optional()
    .refine(
      (val) =>
        !val || val.length === 0 || (val.length >= 7 && val.length <= 20),
      {
        message: "Phone must be between 7 and 20 characters when provided",
      }
    ),
});
