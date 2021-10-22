import { SetStateAction, useCallback, useEffect, useState } from "react";

type MediaScreenSize = "sm" | "md" | "lg";
interface IObjectKeys {
  [key: string]: string | number;
}
interface SizeMapping extends IObjectKeys {
  sm: number;
  md: number;
  lg: number;
}

export default function useMediaQuery(
  mapping: SizeMapping = {
    sm: 992,
    md: 1015,
    lg: 1260,
  }
) {
  const [size, setSize] = useState<MediaScreenSize>("lg");

  const updateSize = useCallback(() => {
    let matched = false;
    Object.keys(mapping).forEach((key) => {
      if (matched) return;
      if (window.innerWidth <= mapping[key]) {
        const k = key as SetStateAction<MediaScreenSize>;
        setSize(k);
        matched = true;
      }
    });
  }, [mapping]);

  useEffect(() => {
    updateSize();
    window.addEventListener("resize", updateSize, false);

    return () => {
      window.removeEventListener("resize", updateSize, false);
    };
  }, [updateSize]);

  return size;
}