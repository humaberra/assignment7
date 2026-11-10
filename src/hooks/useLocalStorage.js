import { useEffect, useState } from "react";

function readValue(key, initialValue) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw === null ? initialValue : JSON.parse(raw);
  } catch {
    // Missing, blocked or corrupted value -> fall back to the default.
    return initialValue;
  }
}

// Same call shape as useState: const [value, setValue] = useLocalStorage(key, initial)
export default function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => readValue(key, initialValue));

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage full or disabled: the app still works, it just won't remember.
    }
  }, [key, value]);

  return [value, setValue];
}