import { collection, CollectionReference, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";

import { firestore } from "../../firebase";
import { User } from "../../firebase/types";
import { useChat } from "../../providers/ChatProvider";

const UsersPanel = () => {
  const [users, setUsers] = useState<User[]>([]);
  const { friendsList, addFriend, removeFriend, currentUser } = useChat();

  // lista wszystkich użytkowników
  useEffect(() => {
    const ref = collection(firestore, "users") as CollectionReference<User>;
    const fetchedUsers: User[] = [];
    getDocs(ref).then((docs) => {
      docs.forEach((doc) => {
        const fetchedUser = doc.data();
        if (fetchedUser) fetchedUsers.push(fetchedUser);
      });
      setUsers(fetchedUsers);
    });
  }, [firestore]);

  const style = { border: "1px solid black", padding: 5 };

  return (
    <div style={{ ...style, maxWidth: 500 }}>
      <h3>Users panel</h3>
      <ol>
        {users.map((user) => {
          const friendsArr = Array.from(friendsList).map((item) => item[0]);
          const currUid = currentUser.val?.uid ?? "";

          const isAddFriendButtonDisabled = friendsArr.includes(user.uid) || user.uid == currUid;
          const isRemoveFriendButtonDisabled = !friendsArr.includes(user.uid) || user.uid == currUid;

          const handleAddFriend = async () => await addFriend(user.uid);
          const handleRemoveFriend = async () => await removeFriend(user.uid);

          return (
            <li key={user.uid} style={style}>
              <p>
                {user.displayName} · {user.email}
              </p>
              <h5 style={{ margin: "5px 0px", background: "green", width: "min-content" }}>{user.uid}</h5>
              <button onClick={handleAddFriend} disabled={isAddFriendButtonDisabled}>
                Add friend
              </button>
              <button onClick={handleRemoveFriend} disabled={isRemoveFriendButtonDisabled}>
                Remove friend
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default UsersPanel;
