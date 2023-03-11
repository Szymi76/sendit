import { Fab, FabProps, IconButton, IconButtonProps, Tooltip, TooltipProps } from "@mui/material";

// IKONA JAKO PRZYCISK Z TYTUŁEM
export type IconAsButtonProps = { icon: React.ReactNode; title: string; fabProps?: FabProps };
export const IconAsButton = (props: IconAsButtonProps) => {
  return (
    <Tooltip title={props.title}>
      <Fab {...props.fabProps}>{props.icon}</Fab>
    </Tooltip>
  );
};
