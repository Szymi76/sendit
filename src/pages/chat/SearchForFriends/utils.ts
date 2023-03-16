import { User } from "../../../types/client";

// FILTRUJE UŻYTKOWNIKÓW, KTÓRZY ZAWIERAJĄ 'ZAPYTANIE'
export const usersWithMatchingQuery = (users: User[], query: string) => {
  const result = users.filter((user) => {
    const a = user.displayName.toLocaleLowerCase().startsWith(query.toLocaleLowerCase());
    const b = user.displayName.toLocaleLowerCase().includes(query.toLocaleLowerCase());
    return a || b;
  });

  return result;
};
