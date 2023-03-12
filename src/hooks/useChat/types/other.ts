//
//
// Inne typy i strukury, które są stosowane w bazie i po stronie klienta
// lub innych częściach hook-a.
//
//

export type ChatType = "individual" | "group";

export type ChatRole = "owner" | "admin" | "user";

export type ChatRolesArray = { uid: string; role: ChatRole }[];
