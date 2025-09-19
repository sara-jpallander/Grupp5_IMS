import { z } from "zod";
import { contactSchema } from "./contact.schema.js";

// Zod schema for Manufacturer validation
export const manufacturerSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters"),
  country: z
    .string()
    .min(2, "Country must be at least 2 characters")
    .max(100, "Country must be at most 100 characters")
    .optional()
    .or(z.literal(""))
    .or(z.null()),
  website: z.url().optional().or(z.literal("")).or(z.null()),
  description: z
    .string()
    .max(500, "Description must be at most 500 characters")
    .optional()
    .or(z.literal(""))
    .or(z.null()),
  address: z
    .string()
    .max(200, "Address must be at most 200 characters")
    .optional()
    .or(z.literal(""))
    .or(z.null()),
  contact: contactSchema, // Nested validation for contact
});
