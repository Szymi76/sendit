// import React, { useContext, useEffect, useRef, useState } from "react";
// import Talk from "talkjs";

// import useAuth from "../../firebase/hooks/useAuth";
// import { SessionContext } from "../../providers/SessionProvider";

// const Chat = () => {
//   const { user } = useAuth();
//   const session = useContext(SessionContext);
//   const [ready, setReady] = useState(false);

//   const chatboxEl = useRef<HTMLDivElement>(null);

//   //if (!user || !session) return <h1>Ładowanie ...</h1>;

//   useEffect(() => {
//     Talk.ready.then(() => setReady(true));

//     if (!ready) return;

//     const currentUser = new Talk.User({
//       id: user?.uid,
//       name: user.displayName ?? "Użytkownik",
//       email: user.email,
//       photoUrl: user.photoURL,
//       role: "default",
//     });

//     const otherUser = new Talk.User({
//       id: "2",
//       name: "Jessica Wells",
//       email: "jessicawells@example.com",
//       photoUrl: "jessica.jpeg",
//       role: "default",
//     });

//     const conversationId = Talk.oneOnOneId(currentUser, otherUser);
//     const conversation = session.getOrCreateConversation(conversationId);
//     conversation?.setParticipant(currentUser);
//     conversation?.setParticipant(otherUser);

//     const chatbox = session.createChatbox();
//     chatbox.select(conversation);

//     if (chatboxEl && chatboxEl.current) chatbox.mount(chatboxEl.current);
//   });

//   return <div ref={chatboxEl} />;
// };

// export default Chat;

export default 1;
