import { z } from "zod";

export const PlatformIdSchema = z.enum(["steam", "epic", "playstation", "xbox"]);
export type PlatformId = z.infer<typeof PlatformIdSchema>;

export const PlatformSchema = z.object({
  id: PlatformIdSchema,
  name: z.string(),
  connected: z.boolean(),
});
export type Platform = z.infer<typeof PlatformSchema>;

export const SessionGradeSchema = z.enum(["S", "A", "B", "C", "D"]);
export type SessionGrade = z.infer<typeof SessionGradeSchema>;

export const SessionSchema = z.object({
  id: z.string(),
  game: z.string(),
  playedAt: z.string(),
  grade: SessionGradeSchema,
  apm: z.number(),
});
export type Session = z.infer<typeof SessionSchema>;

export const UserSchema = z.object({
  id: z.string(),
  gamedId: z.string(),
  displayName: z.string(),
  gigiScore: z.number(),
  globalPercentile: z.number(),
  platforms: z.array(PlatformSchema),
});
export type User = z.infer<typeof UserSchema>;

export const LoginResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  user: UserSchema,
});
export type LoginResponse = z.infer<typeof LoginResponseSchema>;

export const SessionsResponseSchema = z.object({
  sessions: z.array(SessionSchema),
});
export type SessionsResponse = z.infer<typeof SessionsResponseSchema>;

export const ApiErrorSchema = z.object({
  error: z.string(),
});
export type ApiError = z.infer<typeof ApiErrorSchema>;
