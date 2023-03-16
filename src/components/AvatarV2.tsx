import { Avatar, SxProps, Theme } from "@mui/material";

export type AvatarV2Props = { src?: string | File | null; name?: string | null; sx?: SxProps<Theme> };

// AWATAR, POKAZUJE ZDJĘCIE JEŚLI NIE JEST 'null' lub 'undefined', W INNYM PRZYPADKU POKAZUJE PIERWSZĄ LITERE NAZWY
const AvatarV2 = ({ src, name, sx }: AvatarV2Props) => {
  src = src ? src : undefined;
  name = name ? name : undefined;

  if (typeof src != "string" && src !== undefined) {
    src = URL.createObjectURL(src);
  }

  return (
    <Avatar src={src} sx={sx}>
      {!src && name ? name[0] : ""}
    </Avatar>
  );
};

export default AvatarV2;
