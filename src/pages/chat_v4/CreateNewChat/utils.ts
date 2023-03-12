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
  if (participants.length < 1) return "Wymaganych jest co najmniej 1 uczestnik";
  else return null;
};