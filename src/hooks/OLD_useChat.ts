// import { useEffect, useState } from "react";
// import io from "socket.io-client";
// // const socket = io(import.meta.env.VITE_SOCKET_URL, { autoConnect: false });
// import { Manager } from "socket.io-client";

// import useAuth from "../firebase/hooks/useAuth";

// const manager = new Manager(import.meta.env.VITE_SOCKET_URL, {
//   autoConnect: false,
// });

// const socket = manager.socket("/");

// const useChat = () => {
//   const [ready, setReady] = useState(false);
//   const { user, isLoading } = useAuth();

//   // informacja o zmianie statusu znajomego
//   //   socket.on("friend_active_status", ({ uid, active }) => {
//   //     console.log(uid, active);
//   //   });

//   // domyślne łączenie użytkownika
//   useEffect(() => {
//     // if (!user || isLoading || ready) return;

//     manager.open((err) => {
//       if (err) {
//         console.log(err);
//         manager.emit("test");
//       } else {
//         console.log("Sukces");
//         // the connection was successfully established
//       }
//     });

//     // socket.on("connect", () => setReady(true));
//   }, []);

//   //   useEffect(() => {
//   //     if (!ready) return;

//   //     socket.emit("user_connected", user?.uid);
//   //   }, [ready]);

//   return { ready } as const;
// };

// export default useChat;

export default null;
