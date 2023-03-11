import GroupsIcon from "@mui/icons-material/Groups";
import HistoryIcon from "@mui/icons-material/History";
import PersonIcon from "@mui/icons-material/Person";
import { Box, styled } from "@mui/material";

import { IconAsButton } from "../../components";
import { Filter } from "../utils";

export type FilterActionsProps = { changeFilterTo: (filter: Filter) => void };

const FilterActions = ({ changeFilterTo }: FilterActionsProps) => {
  return (
    <Wrapper>
      <IconAsButton
        icon={<HistoryIcon color="secondary" />}
        title="Ostatnie"
        fabProps={{
          variant: "transparent",
          size: "small",
          onClick: () => changeFilterTo("recent"),
        }}
      />
      <IconAsButton
        icon={<PersonIcon color="secondary" />}
        title="Indywidualne"
        fabProps={{
          variant: "transparent",
          size: "small",
          onClick: () => changeFilterTo("individual"),
        }}
      />
      <IconAsButton
        icon={<GroupsIcon color="secondary" />}
        title="Grupowe"
        fabProps={{ variant: "transparent", size: "small", onClick: () => changeFilterTo("group") }}
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
