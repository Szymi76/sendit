import SendbirdChat from "@sendbird/chat";
import { OpenChannelModule, type SendbirdOpenChat } from "@sendbird/chat/openChannel";

const sb = SendbirdChat.init({
  appId: import.meta.env.VITE_APP_ID,

  modules: [new OpenChannelModule()],
}) as SendbirdOpenChat;

export default sb;
