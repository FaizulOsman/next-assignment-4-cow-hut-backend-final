import { z } from "zod";

// Define the Zod schema for creating a order
const createOrderZodSchema = z.object({
  body: z.object({
    cow: z.string({
      required_error: "Cow Id is required",
    }),
    buyer: z.string({
      required_error: "Buyer Id is required",
    }),
    seller: z
      .string({
        required_error: "Seller Id is required",
      })
      .optional(),
    price: z
      .number({
        required_error: "Price is required",
      })
      .optional(),
  }),
});

export const OrderValidation = {
  createOrderZodSchema,
};
