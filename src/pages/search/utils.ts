import { User } from "../../hooks/useChat/types/client";

export const usersWithMatchingQuery = (users: User[], query: string) => {
  const result = users.filter((user) => {
    const a = user.displayName.toLocaleLowerCase().startsWith(query.toLocaleLowerCase());
    const b = user.displayName.toLocaleLowerCase().includes(query.toLocaleLowerCase());
    return a || b;
  });

  return result;
};
