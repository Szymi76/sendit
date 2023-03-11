import { useEffect } from "react";

const useResize = (on: number, callback: () => void) => {
  useEffect(() => {
    const onResize = (e: UIEvent) => {
      const width = window.innerWidth;
      console.log(width);
      if (width == on) callback();
    };

    window.addEventListener("resize", onResize);

    return () => window.removeEventListener("resize", onResize);
  });
};

export default useResize;
