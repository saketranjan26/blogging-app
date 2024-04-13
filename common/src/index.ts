import z from "zod";

export const singupInput = z.object({
  username: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional(),
});

export const signinInput = z.object({
  username: z.string().email(),
  password: z.string().min(6),
});

export const createBlogInput = z.object({
  title: z.string(),
  content: z.string(),
});

export const updateBlogInput = z.object({
  title: z.string(),
  content: z.string(),
});

export type UpdateBlogpInput = z.infer<typeof updateBlogInput>;
export type CreateBlogInput  = z.infer<typeof createBlogInput>;
export type SigninInput      = z.infer<typeof signinInput>;
export type SignupInput      = z.infer<typeof singupInput>;
