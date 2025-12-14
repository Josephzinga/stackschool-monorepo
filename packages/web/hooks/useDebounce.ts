"use client";

import { useEffect, useState } from "react";

export const useDebounce = (delay = 300, value: string | null) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debounced?.trim() === "" && debounced?.length > 1 ? null : debounced;
};
