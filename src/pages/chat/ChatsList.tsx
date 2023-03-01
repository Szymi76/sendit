import React from "react";

import { useChat } from "../../providers/ChatProvider";

const ChatsList = () => {
  const { chats, registerChat, currentUser } = useChat();

  const style = { border: "1px solid black", padding: 5 };

  return (
    <div style={style}>
      <h3>ChatsList</h3>
      {Array.from(chats).map(([id, chat]) => {
        return (
          <div key={id} style={style}>
            <p>{chat.name}</p>
            <button onClick={async () => await registerChat(id)}>SELECT</button>
          </div>
        );
      })}
    </div>
  );
};

export default ChatsList;
