import { z } from "zod";

const blogSchema = z.object({
  title: z
    .string({
      required_error: "Title is required.",
      invalid_type_error: "Title must be a string.",
    })
    .trim()
    .min(4, { message: "Title must be 4 or more characters long." })
    .max(255, { message: "Title must be 255 or fewer characters long." }),
  content: z
    .string({
      required_error: "Content is required.",
      invalid_type_error: "Content must be a string.",
    })
    .trim()
    .min(4, { message: "Content must be 6 or more characters long." }),
});

export { blogSchema };
