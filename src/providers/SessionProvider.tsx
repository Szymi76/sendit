// import { createContext, useEffect, useState } from "react";
// import Talk from "talkjs";

// import useAuth from "../firebase/hooks/useAuth";

// export type Session = Talk.Session;

// export type SessionContextValue = Session | null;

// const defaultValue: SessionContextValue = null;

// export const SessionContext = createContext<SessionContextValue>(defaultValue);

// export type SessionProviderProps = { children: React.ReactNode };

// export const SessionProvider = ({ children }: SessionProviderProps) => {
//   const [session, setSession] = useState<SessionContextValue>(null);
//   const { user, isLoading } = useAuth();

//   useEffect(() => {
//     const updateSession = async () => {
//       // czekanie na załadowanie talkjs
//       await Talk.ready;

//       // sprawdzanie czy użytkownik jest zalogowany
//       if (!user || isLoading) return;

//       // tworzenie użytkownika talkjs
//       const talkUser = new Talk.User({
//         id: user.uid,
//         name: user.displayName ?? "Użytkownik",
//         email: user.email,
//         photoUrl: user.photoURL,
//         role: "default",
//       });

//       // tworzenie sessji
//       const newSession = new Talk.Session({
//         appId: import.meta.env.VITE_APP_ID,
//         me: talkUser,
//       });

//       // [DEBUG]
//       console.log(newSession);

//       // ustawanie sessji
//       setSession(newSession);
//     };

//     // aktualizacja sesji podczas zmiany użytkownika
//     updateSession();

//     // niszczenie sessji podczas demontarzu komponentu
//     return () => {
//       if (!session) return;
//       session.destroy();
//     };
//   }, [user, isLoading]);

//   return <SessionContext.Provider value={session}>{children}</SessionContext.Provider>;
// };

const _ = 1;
export default _;
