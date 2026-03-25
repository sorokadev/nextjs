export const AUTH_COOKIE_NAME = "fd_role";

export type UserRole = "individual" | "admin";

export const USER_ROLES: readonly UserRole[] = ["individual", "admin"] as const;

