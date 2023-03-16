import { User } from "../../../types/client";

export type Errors = { name: string | null; participants: string | null; active: boolean };
export type DataType = { name: string; participants: User[]; photoURL: File | null };

// SPRAWDZA CZY NAZWA CZATU JEST OKEJ
export const validateNameField = (name: string) => {
  if (name.length == 0) return "Nazwa czatu jest wymagana";
  else if (name.length < 4) return "Nazwa czatu jest za krótka";
  else if (name.length > 16) return "Nazwa czatu jest za długa";
  else return null;
};

// SPRAWDZA CZY LISTA UCZESTNIKÓW JEST OKEJ
export const validateParticipantsField = (participants: User[]) => {
  if (participants.length < 1) return "Wymaganych jest co najmniej 1 uczestnik";
  else return null;
};
