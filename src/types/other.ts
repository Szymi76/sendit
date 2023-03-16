import { User } from "./client";

export type ChatType = "individual" | "group";

export type ChatRole = "owner" | "admin" | "user";

export type ChatUser = User & { role: ChatRole };
