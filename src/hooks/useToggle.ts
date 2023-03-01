import { useCallback, useState } from "react";

const useToggle = (initialValue = false) => {
  const [state, setState] = useState(initialValue);

  const toggle = useCallback((to?: boolean) => {
    if (typeof to === "boolean") setState(to);
    else setState((state) => !state);
  }, []);

  return [state, toggle] as const;
};

export default useToggle;
