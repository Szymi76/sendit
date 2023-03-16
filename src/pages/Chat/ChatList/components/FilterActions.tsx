import GroupsIcon from "@mui/icons-material/Groups";
import HistoryIcon from "@mui/icons-material/History";
import PersonIcon from "@mui/icons-material/Person";
import { Box, FabProps, styled } from "@mui/material";

import IconAsButton from "../../../../components/IconAsButton";
import { Filter } from "../utils";

const fabProps: FabProps = { variant: "transparent", size: "small" };

export type FilterActionsProps = { changeFilterTo: (filter: Filter) => void };

// FILTRY POD INPUTEM DO WYSZUKIWANIA W LIŚCIE
const FilterActions = ({ changeFilterTo }: FilterActionsProps) => {
  return (
    <Wrapper>
      <IconAsButton
        icon={<HistoryIcon color="secondary" />}
        title="Ostatnie"
        fabProps={{ ...fabProps, onClick: () => changeFilterTo("recent") }}
      />
      <IconAsButton
        icon={<PersonIcon color="secondary" />}
        title="Indywidualne"
        fabProps={{ ...fabProps, onClick: () => changeFilterTo("individual") }}
      />
      <IconAsButton
        icon={<GroupsIcon color="secondary" />}
        title="Grupowe"
        fabProps={{ ...fabProps, onClick: () => changeFilterTo("group") }}
      />
    </Wrapper>
  );
};

export default FilterActions;

const Wrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "center",
  gap: theme.spacing(2),
  padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
}));
