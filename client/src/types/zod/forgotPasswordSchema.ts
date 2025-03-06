import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
const forgotPasswordResolver = zodResolver(forgotPasswordSchema);
export default forgotPasswordResolver;
