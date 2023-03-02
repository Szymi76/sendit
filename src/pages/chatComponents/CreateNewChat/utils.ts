import { UserObject } from "../../../firebase/collections";

export type OptionItem = { label: string; uid: string };
export type Errors = { name: string | null; participants: string | null; active: boolean };
export type DataType = { name: string; participants: OptionItem[]; photoURL: File | null };

// sprawdza czy nazwa nowgo czatu jest prawidłowa
export const validateNameField = (name: string) => {
  if (name.length == 0) return "Nazwa czatu jest wymagana";
  else if (name.length < 4) return "Nazwa czatu jest za krótka";
  else if (name.length > 16) return "Nazwa czatu jest za długa";
  else return null;
};

// sprawdza czy lista uczestników nowego czatu jest okej
export const validateParticipantsField = (participants: OptionItem[]) => {
  if (participants.length < 2) return "Wymaganych jest co najmniej 2 uczestników";
  else return null;
};

// formatuje mapę na tablice objektów -> {  label: string, uid: string }
export const formatToOptionsArray = (map: Map<string, UserObject>) => {
  return Array.from(map).map(([uid, user]) => {
    return user.val ? { label: user.val.displayName, uid } : null;
  });
};

// filtruje tablicę objektów z wartości null (ps. coś się popsuło z typami dla tego czegoś?!)
export const filterOptionsArray = (map: Map<string, UserObject>) => {
  return formatToOptionsArray(map).filter((item) => item != null);
};
