import { Autocomplete, Box, TextField } from "@mui/material";
import { where } from "firebase/firestore";
import React, { useMemo, useState } from "react";

import { User } from "../../firebase/types";
import useAuth from "../../firebase/hooks/useAuth";
import useGetDocumentsWithQuery from "../../firebase/hooks/useGetDocuments";
import UserCard from "./UserCard";

const Search = () => {
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const { data: users, isLoading } = useGetDocumentsWithQuery<User>("users", where("displayName", "!=", null));

  const options = useMemo(() => users.map((u) => u.displayName), [users]);

  return (
    <Box>
      {/* <Box>
        <Autocomplete
          disablePortal
          options={options}
          size="medium"
          renderInput={(params) => <TextField {...params} />}
        />
      </Box> */}
      <Box display="flex" flexDirection="column" gap={1} mt={3}>
        {users.map((u) => (
          <UserCard key={u.uid} user={u} />
        ))}
      </Box>
    </Box>
  );
};

export default Search;
