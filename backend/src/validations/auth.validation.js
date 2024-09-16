import { z } from "zod";

const userLoginOrSignupSchema = z.object({
  email: z
    .string({
      required_error: "Email is required.",
      invalid_type_error: "Email must be a string.",
    })
    .email({ message: "Invalid email address." })
    .trim()
    .max(255, { message: "Email must be 255 or fewer characters long." }),
  password: z
    .string({
      required_error: "Password is required.",
      invalid_type_error: "Password must be a string.",
    })
    .trim()
    .min(6, { message: "Password must be 6 or more characters long." })
    .max(255, { message: "Password must be 255 or fewer characters long." }),
});

export { userLoginOrSignupSchema };
