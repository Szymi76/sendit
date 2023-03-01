import React, { useRef, useState } from "react";

import { useChat } from "../../providers/ChatProvider";

const CreateNewChat = () => {
  const { createChat, currentUser } = useChat();
  const [participantsUids, setParticipantsUids] = useState<string[]>(["temp"]);

  const inputRef = useRef<HTMLInputElement>(null);

  const clearParticipants = () => setParticipantsUids([currentUser.val!.uid]);

  // @ts-ignore
  const handleAddParticipants = () => setParticipantsUids([...participantsUids, inputRef!.current!.value]);

  const handleAddChat = async () => {
    const type = participantsUids.length > 1 ? "individual" : "group";
    await createChat(participantsUids, type);
  };

  const isChatDisabled = participantsUids.length <= 1;

  const style = { border: "1px solid black", padding: 5 };

  return (
    <div style={{ ...style, width: 500 }}>
      <h3>Create new chat</h3>
      <div style={style}>
        <p>Participants:</p>
        <input ref={inputRef} type="text" />
        <button onClick={handleAddParticipants}>Add participant id</button>
        {participantsUids.map((id) => (
          <p key={id} style={style}>
            {id}
          </p>
        ))}
        <button onClick={clearParticipants}>Clear</button>
      </div>
      <div style={style}>
        <button onClick={handleAddChat} disabled={isChatDisabled}>
          Add new chat
        </button>
      </div>
    </div>
  );
};

export default CreateNewChat;
