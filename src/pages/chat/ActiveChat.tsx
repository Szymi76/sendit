import React, { useRef } from "react";

import { useChat } from "../../providers/ChatProvider";

const ActiveChat = () => {
  const { chats, registeredChatId, sendMessage, currentUser } = useChat();
  const inputRef = useRef<HTMLInputElement>(null);

  const style = { border: "1px solid black", padding: 5 };

  const chat = chats.get(registeredChatId ?? "");

  const handleSendMessage = async () => {
    const text = inputRef.current!.value;
    await sendMessage(registeredChatId!, { text });
    inputRef.current!.value = "";
  };

  // console.log(registeredChatId, chat);

  return (
    <div style={style}>
      <h3>ActiveChat</h3>
      {registeredChatId === null ? (
        <h4 style={style}>None chat is selected ...</h4>
      ) : (
        <div style={style}>
          {chat && (
            <>
              <h5>{chat.name}</h5>
              {chat.messages.values?.map((msg, index) => {
                let author = msg.author.val?.displayName ?? "Ktoś";
                if (author == currentUser.val?.displayName) author = "Ja";
                return (
                  <p key={index}>
                    {author} : {msg.text}
                  </p>
                );
              })}
              <div style={style}>
                <input type="text" ref={inputRef} />
                <button onClick={handleSendMessage}>Send</button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ActiveChat;
