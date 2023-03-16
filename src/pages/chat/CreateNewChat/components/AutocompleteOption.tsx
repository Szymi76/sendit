import { Typography } from "@mui/material";

import AvatarV2 from "../../../../components/AvatarV2";
import { User } from "../../../../types/client";

export type OptionProps = { props: React.HTMLAttributes<HTMLLIElement>; option: User };

// ELEMENT LISTY DO WYBIERANIA UCZESTNIKÓW NOWEGO CZATU
const AutocompleteOption = ({ props, option }: OptionProps) => {
  return (
    <li {...props} style={{ display: "flex", gap: "16px", alignItems: "center" }}>
      <AvatarV2 name={option.displayName} src={option.photoURL} />
      <Typography>{option.displayName}</Typography>
    </li>
  );
};

export default AutocompleteOption;
