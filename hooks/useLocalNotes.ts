import { useEffect, useState } from "react";

const STORAGE_KEY = "teacherdash.notes";

export function useLocalNotes() {
  const [note, setNote] = useState("");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setNote(saved);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, note);
  }, [note]);

  return { note, setNote };
}
