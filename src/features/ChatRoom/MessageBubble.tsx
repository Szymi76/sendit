import { Box, Tooltip, Typography } from "@mui/material";

import AvatarV2 from "../../components/AvatarV2";
import { Message } from "../../types/client";

export type MessageBubbleProps = { message: Message; isMy: boolean };

// DYMEK Z WIADOMOŚCIĄ. NA PODSTAWIE 'isMy' ZMIENIANY JEST KOLOR, KSZTAŁT ITP.
const MessageBubble = ({ message, isMy }: MessageBubbleProps) => {
  const sentAt = message.createdAt.toDate().toString().substring(16, 21);
  const fullDate = message.createdAt.toDate().toLocaleDateString();
  const isChatHaveAnyFiles = message.files.length > 0;

  const filesJSXArray = message.files.map((file, index) => <SingleImageInMessage key={index} src={file as string} />);

  return (
    <Box width="100%" display="flex" justifyContent={isMy ? "flex-end" : "flex-start"} p={5}>
      <Box display="flex" flexDirection={isMy ? "row-reverse" : "row"}>
        <Box display="flex" flexDirection="column" justifyContent="flex-end" alignItems="center">
          <AvatarV2 name={message.author!.displayName} src={message.author!.photoURL} />
          <Tooltip title={fullDate}>
            <Typography variant="body2" color={(theme) => theme.palette.text.primary}>
              {sentAt}
            </Typography>
          </Tooltip>
        </Box>

        <MessageBubbleContentWrapper isMy={isMy}>
          <Typography
            position="absolute"
            top={-23}
            left={5}
            variant="subtitle2"
            color={(theme) => theme.palette.text.primary}
          >
            {message.author!.displayName}
          </Typography>

          <Box display="flex" flexDirection="column">
            {isChatHaveAnyFiles && (
              <Box display="flex" flexWrap="wrap" justifyContent="center" gap={2} mb={1}>
                {filesJSXArray}
              </Box>
            )}
            <Typography
              variant="body1"
              sx={{
                wordWrap: "break-word",
                color: (theme) => {
                  return isMy ? theme.palette.common.white : theme.palette.common.black;
                },
              }}
            >
              {message.text}
            </Typography>
          </Box>
        </MessageBubbleContentWrapper>
      </Box>
    </Box>
  );
};

export default MessageBubble;

type MessageBubbleContentWrapperProps = { children: React.ReactNode; isMy: boolean };

const MessageBubbleContentWrapper = ({ children, isMy }: MessageBubbleContentWrapperProps) => {
  return (
    <Box
      maxWidth="400px"
      position="relative"
      my={7}
      mx={2}
      p={2}
      borderRadius={`8px 8px ${isMy ? "0px" : "8px"} ${isMy ? "8px" : "0px"}`}
      sx={{
        bgcolor: (theme) => {
          return isMy ? theme.palette.primary.main : theme.palette.grey[300];
        },
      }}
    >
      {children}
    </Box>
  );
};

type SingleImageInMessageProps = { src: string };

const SingleImageInMessage = ({ src }: SingleImageInMessageProps) => {
  return (
    <img
      src={src}
      height={175}
      width={175}
      style={{ borderRadius: 8, objectFit: "cover", maxWidth: 175, maxHeight: 175 }}
      alt="Zdjęcie"
    />
  );
};
