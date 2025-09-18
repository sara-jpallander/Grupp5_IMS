import { z } from "zod";

// Zod schema for Product validation
export const productSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters"),
  sku: z
    .string()
    .min(3, "SKU must be at least 3 characters")
    .max(20, "SKU must be at most 20 characters"),
  description: z
    .string()
    .max(500, "Description must be at most 500 characters")
    .optional(),
  price: z.number().min(0, "Price must be a positive number"),
  category: z
    .string()
    .max(100, "Category must be at most 100 characters")
    .optional(),
  manufacturer: z
    .string()
    .length(24, "Manufacturer ID must be a valid ObjectId"),
  amountInStock: z
    .number()
    .int()
    .min(0, "Amount in stock must be a positive number"),
});
